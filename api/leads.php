<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
  $host = $_SERVER['HTTP_HOST'] ?? '';
  $allowed = [
    'https://' . $host,
    'http://' . $host,
  ];
  if (!in_array($origin, $allowed, true)) {
    http_response_code(403);
    echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
    exit;
  }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Max-Age: 86400');
  http_response_code(204);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 1024 * 1024) {
  http_response_code(413);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

$hp = trim((string)($payload['hp'] ?? ''));
if ($hp !== '') {
  http_response_code(204);
  exit;
}

$ts = (int)($payload['ts'] ?? 0);
if ($ts > 0) {
  $now = time();
  if (abs($now - $ts) > 3600) {
    http_response_code(204);
    exit;
  }
}

$sanitize = static function ($v, int $max) {
  $s = is_string($v) ? $v : '';
  $s = trim($s);
  $s = preg_replace('/[<>]/', '', $s);
  $s = preg_replace('/\s+/', ' ', $s);
  $s = mb_substr($s, 0, $max, 'UTF-8');
  return $s;
};

$firstName = $sanitize($payload['firstName'] ?? '', 50);
$lastName = $sanitize($payload['lastName'] ?? '', 50);
$email = $sanitize($payload['email'] ?? '', 120);
$phone = $sanitize($payload['phone'] ?? '', 20);
$university = $sanitize($payload['university'] ?? '', 120);
$course = $sanitize($payload['course'] ?? '', 120);
$consent = (bool)($payload['consent'] ?? false);

if ($firstName === '' || $lastName === '' || $email === '' || $phone === '' || !$consent) {
  http_response_code(204);
  exit;
}
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  http_response_code(204);
  exit;
}

$ip = $sanitize($_SERVER['REMOTE_ADDR'] ?? '', 64);
$ua = $sanitize($_SERVER['HTTP_USER_AGENT'] ?? '', 255);
$ref = $sanitize($_SERVER['HTTP_REFERER'] ?? '', 255);

$config = null;
$localConfigPath = __DIR__ . DIRECTORY_SEPARATOR . 'config.local.php';
if (is_file($localConfigPath)) {
  $config = require $localConfigPath;
} else {
  $config = [
    'db_host' => getenv('LEADS_DB_HOST') ?: '',
    'db_name' => getenv('LEADS_DB_NAME') ?: '',
    'db_user' => getenv('LEADS_DB_USER') ?: '',
    'db_pass' => getenv('LEADS_DB_PASS') ?: '',
  ];
}

if (!is_array($config)) {
  http_response_code(500);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

$dbHost = (string)($config['db_host'] ?? '');
$dbName = (string)($config['db_name'] ?? '');
$dbUser = (string)($config['db_user'] ?? '');
$dbPass = (string)($config['db_pass'] ?? '');

if ($dbHost === '' || $dbName === '' || $dbUser === '') {
  http_response_code(500);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  $dsn = 'mysql:host=' . $dbHost . ';dbname=' . $dbName . ';charset=utf8mb4';
  $pdo = new PDO($dsn, $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  $stmt = $pdo->prepare('INSERT INTO leads (created_at, ip, user_agent, referrer, first_name, last_name, email, phone, university, course, consent) VALUES (NOW(), :ip, :ua, :ref, :fn, :ln, :em, :ph, :un, :co, :cs)');
  $stmt->execute([
    ':ip' => $ip,
    ':ua' => $ua,
    ':ref' => $ref,
    ':fn' => $firstName,
    ':ln' => $lastName,
    ':em' => $email,
    ':ph' => $phone,
    ':un' => $university,
    ':co' => $course,
    ':cs' => $consent ? 1 : 0,
  ]);

  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
}

