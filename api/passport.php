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
if (strlen($raw) > 2048) {
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

$sanitize = static function ($v, int $max) {
  $s = is_string($v) ? $v : '';
  $s = trim($s);
  $s = preg_replace('/[<>]/', '', $s);
  $s = preg_replace('/\s+/', ' ', $s);
  $s = mb_substr($s, 0, $max, 'UTF-8');
  return $s;
};

$email = $sanitize($payload['email'] ?? '', 120);
$birthDate = $sanitize($payload['birthDate'] ?? '', 10);

if ($email === '' || $birthDate === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Email e data de nascimento são obrigatórios.'], JSON_UNESCAPED_UNICODE);
  exit;
}
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Email inválido.'], JSON_UNESCAPED_UNICODE);
  exit;
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthDate)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Formato de data inválido.'], JSON_UNESCAPED_UNICODE);
  exit;
}

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

  $stmt = $pdo->prepare('SELECT first_name, last_name, email, phone, birth_date, university, course, photo FROM leads WHERE email = :em AND birth_date = :bd LIMIT 1');
  $stmt->execute([':em' => $email, ':bd' => $birthDate]);
  $row = $stmt->fetch();

  if (!$row) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'Passaporte não encontrado. Verifique o email e data de nascimento.'], JSON_UNESCAPED_UNICODE);
    exit;
  }

  echo json_encode([
    'ok' => true,
    'passport' => [
      'firstName' => $row['first_name'],
      'lastName'  => $row['last_name'],
      'email'     => $row['email'],
      'phone'     => $row['phone'],
      'birthDate' => $row['birth_date'],
      'university'=> $row['university'],
      'course'    => $row['course'],
      'photo'     => $row['photo'],
    ],
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Erro interno.'], JSON_UNESCAPED_UNICODE);
}
