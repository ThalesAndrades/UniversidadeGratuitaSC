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
if (strlen($raw) > 8 * 1024 * 1024) {
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
$birthDate = $sanitize($payload['birthDate'] ?? '', 10);
$university = $sanitize($payload['university'] ?? '', 120);
$course = $sanitize($payload['course'] ?? '', 120);
$consent = (bool)($payload['consent'] ?? false);
$photo = is_string($payload['photo'] ?? null) ? ($payload['photo']) : '';

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
    'db_host' => getenv('LEADS_DB_HOST') ?: 'localhost',
    'db_name' => getenv('LEADS_DB_NAME') ?: 'u525832347_passaporte',
    'db_user' => getenv('LEADS_DB_USER') ?: 'u525832347_acafe',
    'db_pass' => getenv('LEADS_DB_PASS') ?: '@PassAcafe!2026',
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

  $courseKeyRaw = trim($course);
  $courseKey = function_exists('mb_strtolower') ? mb_strtolower($courseKeyRaw, 'UTF-8') : strtolower($courseKeyRaw);

  try {
    $pdo->beginTransaction();

    $upsertUniversity = $pdo->prepare('INSERT INTO universities (university_key, name) VALUES (:uk, :nm) ON DUPLICATE KEY UPDATE name = VALUES(name)');
    $upsertUniversity->execute([
      ':uk' => $university,
      ':nm' => $university,
    ]);

    $selectUniversity = $pdo->prepare('SELECT id FROM universities WHERE university_key = :uk LIMIT 1');
    $selectUniversity->execute([':uk' => $university]);
    $urow = $selectUniversity->fetch();
    $universityId = is_array($urow) && isset($urow['id']) ? (int)$urow['id'] : null;

    $courseId = null;
    if ($universityId !== null && $courseKey !== '') {
      $upsertCourse = $pdo->prepare('INSERT INTO courses (university_id, course_key, name) VALUES (:uid, :ck, :nm) ON DUPLICATE KEY UPDATE name = VALUES(name)');
      $upsertCourse->execute([
        ':uid' => $universityId,
        ':ck' => $courseKey,
        ':nm' => $course,
      ]);

      $selectCourse = $pdo->prepare('SELECT id FROM courses WHERE university_id = :uid AND course_key = :ck LIMIT 1');
      $selectCourse->execute([
        ':uid' => $universityId,
        ':ck' => $courseKey,
      ]);
      $crow = $selectCourse->fetch();
      $courseId = is_array($crow) && isset($crow['id']) ? (int)$crow['id'] : null;
    }

    $stmt = $pdo->prepare('INSERT INTO leads (created_at, ip, user_agent, referrer, first_name, last_name, email, phone, birth_date, university, course, university_id, course_id, photo, consent) VALUES (NOW(), :ip, :ua, :ref, :fn, :ln, :em, :ph, :bd, :un, :co, :uid, :cid, :ph2, :cs)');
    $stmt->execute([
      ':ip' => $ip,
      ':ua' => $ua,
      ':ref' => $ref,
      ':fn' => $firstName,
      ':ln' => $lastName,
      ':em' => $email,
      ':ph' => $phone,
      ':bd' => $birthDate !== '' ? $birthDate : null,
      ':un' => $university,
      ':co' => $course,
      ':uid' => $universityId,
      ':cid' => $courseId,
      ':ph2' => $photo !== '' ? $photo : null,
      ':cs' => $consent ? 1 : 0,
    ]);

    $pdo->commit();
  } catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();

    // Check for duplicate email (unique constraint violation)
    if ($e->getCode() == '23000' || strpos($e->getMessage(), 'Duplicate') !== false) {
      http_response_code(409);
      echo json_encode(['ok' => false, 'error' => 'duplicate_email', 'message' => 'Este email já possui um passaporte cadastrado. Use "Acessar Meu Passaporte" para recuperá-lo.'], JSON_UNESCAPED_UNICODE);
      exit;
    }

    $stmt = $pdo->prepare('INSERT INTO leads (created_at, ip, user_agent, referrer, first_name, last_name, email, phone, birth_date, university, course, photo, consent) VALUES (NOW(), :ip, :ua, :ref, :fn, :ln, :em, :ph, :bd, :un, :co, :ph2, :cs)');
    $stmt->execute([
      ':ip' => $ip,
      ':ua' => $ua,
      ':ref' => $ref,
      ':fn' => $firstName,
      ':ln' => $lastName,
      ':em' => $email,
      ':ph' => $phone,
      ':bd' => $birthDate !== '' ? $birthDate : null,
      ':un' => $university,
      ':co' => $course,
      ':ph2' => $photo !== '' ? $photo : null,
      ':cs' => $consent ? 1 : 0,
    ]);
  }

  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
}

