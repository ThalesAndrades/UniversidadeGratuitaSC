<?php
declare(strict_types=1);

/**
 * Security middleware — rate limiting, input hardening, audit logging.
 *
 * Include at the top of every public API endpoint:
 *   require __DIR__ . '/security.php';
 */

// ── Suppress PHP fingerprinting ─────────────────────────────────────────────
@ini_set('expose_php', '0');
@ini_set('display_errors', '0');
@ini_set('display_startup_errors', '0');
@ini_set('log_errors', '1');
if (function_exists('header_remove')) {
  @header_remove('X-Powered-By');
  @header_remove('Server');
}

// ── Storage directory for rate-limit counters and audit logs ────────────────
define('SECURITY_STORAGE', __DIR__ . DIRECTORY_SEPARATOR . '.security');

if (!is_dir(SECURITY_STORAGE)) {
  @mkdir(SECURITY_STORAGE, 0700, true);
}

// ── Helper: get client IP (respects reverse-proxy headers safely) ──────────
function sec_client_ip(): string
{
  // On Hostinger, REMOTE_ADDR is reliable.
  // Only trust X-Forwarded-For if behind a known proxy.
  $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
  // Normalize IPv6 loopback
  if ($ip === '::1') {
    $ip = '127.0.0.1';
  }
  return preg_replace('/[^a-fA-F0-9\.\:]/', '', $ip);
}

// ── Rate Limiter (file-based, per-IP) ──────────────────────────────────────
/**
 * Check whether the current IP has exceeded the allowed request count within
 * the given time window. Returns true if request is ALLOWED, false if blocked.
 *
 * @param string $bucket   Namespace (e.g. 'leads', 'passport')
 * @param int    $maxHits  Maximum requests in the window
 * @param int    $windowSec  Time window in seconds
 * @return bool  true = allowed, false = rate-limited
 */
function sec_rate_limit(string $bucket, int $maxHits, int $windowSec): bool
{
  $ip = sec_client_ip();
  $dir = SECURITY_STORAGE . DIRECTORY_SEPARATOR . 'ratelimit';
  if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
  }

  // One file per IP+bucket, contains JSON array of timestamps
  $safeKey = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $bucket . '_' . $ip);
  $file = $dir . DIRECTORY_SEPARATOR . $safeKey . '.json';

  $now = time();
  $hits = [];

  // Read existing hits
  if (is_file($file)) {
    $raw = @file_get_contents($file);
    $decoded = json_decode($raw ?: '[]', true);
    if (is_array($decoded)) {
      // Keep only hits within the window
      $hits = array_values(array_filter($decoded, static function ($ts) use ($now, $windowSec) {
        return ($now - $ts) < $windowSec;
      }));
    }
  }

  // Check limit
  if (count($hits) >= $maxHits) {
    sec_audit('rate_limited', ['bucket' => $bucket, 'ip' => $ip, 'hits' => count($hits)]);
    return false; // BLOCKED
  }

  // Record this hit
  $hits[] = $now;
  @file_put_contents($file, json_encode($hits), LOCK_EX);

  return true; // ALLOWED
}

/**
 * Enforce rate limit — sends 429 and exits if blocked.
 */
function sec_enforce_rate_limit(string $bucket, int $maxHits, int $windowSec): void
{
  if (!sec_rate_limit($bucket, $maxHits, $windowSec)) {
    http_response_code(429);
    header('Retry-After: ' . $windowSec);
    echo json_encode([
      'ok' => false,
      'error' => 'rate_limit',
      'message' => 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
  }
}

// ── Cleanup stale rate-limit files (probabilistic, ~1% of requests) ────────
if (mt_rand(1, 100) === 1) {
  $rlDir = SECURITY_STORAGE . DIRECTORY_SEPARATOR . 'ratelimit';
  if (is_dir($rlDir)) {
    $cutoff = time() - 7200; // 2 hours old
    foreach ((array)@scandir($rlDir) as $f) {
      if ($f === '.' || $f === '..') continue;
      $fp = $rlDir . DIRECTORY_SEPARATOR . $f;
      if (is_file($fp) && filemtime($fp) < $cutoff) {
        @unlink($fp);
      }
    }
  }
}

// ── Audit Logger ───────────────────────────────────────────────────────────
/**
 * Log a security event to daily log file.
 */
function sec_audit(string $event, array $context = []): void
{
  $dir = SECURITY_STORAGE . DIRECTORY_SEPARATOR . 'logs';
  if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
  }

  $entry = [
    'ts'    => date('Y-m-d H:i:s'),
    'event' => $event,
    'ip'    => sec_client_ip(),
    'ua'    => mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200, 'UTF-8'),
  ];
  if ($context) {
    $entry['ctx'] = $context;
  }

  $file = $dir . DIRECTORY_SEPARATOR . date('Y-m-d') . '.log';
  @file_put_contents($file, json_encode($entry, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}

// Cleanup old audit logs (keep 30 days, probabilistic ~1%)
if (mt_rand(1, 100) === 1) {
  $logDir = SECURITY_STORAGE . DIRECTORY_SEPARATOR . 'logs';
  if (is_dir($logDir)) {
    $cutoff = time() - 86400 * 30;
    foreach ((array)@scandir($logDir) as $f) {
      if ($f === '.' || $f === '..') continue;
      $fp = $logDir . DIRECTORY_SEPARATOR . $f;
      if (is_file($fp) && filemtime($fp) < $cutoff) {
        @unlink($fp);
      }
    }
  }
}

// ── Input Sanitizer (hardened) ─────────────────────────────────────────────
/**
 * Sanitize a string input: strip tags, control chars, null bytes, and limit length.
 */
function sec_sanitize(mixed $v, int $maxLen): string
{
  $s = is_string($v) ? $v : '';
  // Remove null bytes
  $s = str_replace("\0", '', $s);
  // Remove control characters (except newline/tab for multiline fields)
  $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $s);
  // Strip any HTML/XML tags
  $s = strip_tags($s);
  // Remove potential JS/event patterns
  $s = preg_replace('/(?:javascript|vbscript|data)\s*:/i', '', $s);
  $s = preg_replace('/on\w+\s*=/i', '', $s);
  // Collapse whitespace
  $s = trim(preg_replace('/\s+/', ' ', $s));
  // Limit length
  $s = mb_substr($s, 0, $maxLen, 'UTF-8');
  return $s;
}

// ── CORS validation ────────────────────────────────────────────────────────
/**
 * Validate CORS origin. On production, only HTTPS is allowed.
 * Returns true if valid, false if rejected (and sends 403).
 */
function sec_cors_check(): bool
{
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin === '') {
    return true; // Same-origin requests don't send Origin header
  }

  $host = $_SERVER['HTTP_HOST'] ?? '';
  $allowed = ['https://' . $host];

  // Allow HTTP only on localhost for development
  if (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false) {
    $allowed[] = 'http://' . $host;
  }

  if (!in_array($origin, $allowed, true)) {
    sec_audit('cors_rejected', ['origin' => $origin, 'host' => $host]);
    http_response_code(403);
    echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
    exit;
  }

  return true;
}

// ── Security headers (PHP-level backup to .htaccess) ───────────────────────
function sec_response_headers(): void
{
  // Hide technology fingerprints
  @header_remove('X-Powered-By');
  @header_remove('Server');

  header('X-Content-Type-Options: nosniff');
  header('X-Frame-Options: DENY');
  header('X-Robots-Tag: noindex, nofollow');
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Pragma: no-cache');
  header('Referrer-Policy: strict-origin-when-cross-origin');
  header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
}

// ── Photo validation ───────────────────────────────────────────────────────
/**
 * Validate that a photo string is a legitimate base64-encoded image.
 * Returns sanitized photo string or empty string.
 */
function sec_validate_photo(string $photo, int $maxBytes = 5 * 1024 * 1024): string
{
  if ($photo === '') return '';

  // Must start with data:image/ prefix
  if (!preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,/', $photo, $m)) {
    return '';
  }

  // Check total size
  if (strlen($photo) > $maxBytes) {
    return '';
  }

  // Extract and validate base64 portion
  $parts = explode(',', $photo, 2);
  if (count($parts) !== 2) return '';

  $decoded = base64_decode($parts[1], true);
  if ($decoded === false) return '';

  // Verify it's actually an image by checking magic bytes
  $header = substr($decoded, 0, 8);
  $isJpeg = (substr($header, 0, 2) === "\xFF\xD8");
  $isPng  = (substr($header, 0, 4) === "\x89PNG");
  $isWebp = (substr($header, 0, 4) === "RIFF" && substr($decoded, 8, 4) === "WEBP");

  if (!$isJpeg && !$isPng && !$isWebp) {
    sec_audit('invalid_photo', ['mime' => $m[1], 'size' => strlen($photo)]);
    return '';
  }

  return $photo;
}

// ── Request method + preflight handler ─────────────────────────────────────
function sec_method_check(string $allowed = 'POST'): void
{
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: ' . $allowed . ', OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
  }

  if (($_SERVER['REQUEST_METHOD'] ?? '') !== $allowed) {
    http_response_code(405);
    echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
    exit;
  }
}

// ── Honeypot + timestamp anti-bot checks ───────────────────────────────────
/**
 * Check honeypot field and timestamp. Silently rejects bots (HTTP 204).
 */
function sec_anti_bot(array $payload): void
{
  // Honeypot: hidden field that should be empty
  $hp = trim((string)($payload['hp'] ?? ''));
  if ($hp !== '') {
    sec_audit('honeypot_triggered', ['hp_len' => strlen($hp)]);
    http_response_code(204);
    exit;
  }

  // Timestamp: reject if too old or too far in future
  $ts = (int)($payload['ts'] ?? 0);
  if ($ts > 0) {
    $diff = abs(time() - $ts);
    if ($diff > 300) { // 5 minutes (tighter than the previous 1 hour)
      sec_audit('stale_timestamp', ['diff' => $diff]);
      http_response_code(204);
      exit;
    }
  }

  // Minimum submission time: reject if form submitted in under 2 seconds
  // (indicates automated submission)
  if ($ts > 0 && (time() - $ts) < 2) {
    sec_audit('too_fast', ['diff' => time() - $ts]);
    http_response_code(204);
    exit;
  }
}

// ── Database config loader ─────────────────────────────────────────────────
function sec_load_db_config(): array
{
  $localConfigPath = __DIR__ . DIRECTORY_SEPARATOR . 'config.local.php';
  if (is_file($localConfigPath)) {
    $config = require $localConfigPath;
    if (is_array($config)) return $config;
  }

  return [
    'db_host' => getenv('LEADS_DB_HOST') ?: 'localhost',
    'db_name' => getenv('LEADS_DB_NAME') ?: '',
    'db_user' => getenv('LEADS_DB_USER') ?: '',
    'db_pass' => getenv('LEADS_DB_PASS') ?: '',
  ];
}

/**
 * Connect to database using config.
 */
function sec_connect_db(): PDO
{
  $config = sec_load_db_config();

  $dbHost = (string)($config['db_host'] ?? '');
  $dbName = (string)($config['db_name'] ?? '');
  $dbUser = (string)($config['db_user'] ?? '');
  $dbPass = (string)($config['db_pass'] ?? '');

  if ($dbHost === '' || $dbName === '' || $dbUser === '') {
    http_response_code(500);
    echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
    exit;
  }

  $dsn = 'mysql:host=' . $dbHost . ';dbname=' . $dbName . ';charset=utf8mb4';
  return new PDO($dsn, $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
  ]);
}
