<?php
declare(strict_types=1);

require __DIR__ . '/security.php';

header('Content-Type: application/json; charset=utf-8');
sec_response_headers();

// ── CORS ────────────────────────────────────────────────────────────────────
sec_cors_check();

// ── Method check (POST only) ────────────────────────────────────────────────
sec_method_check('POST');

// ── Rate limiting: 8 lookups per 5 min per IP (brute-force protection) ──────
sec_enforce_rate_limit('passport', 8, 300);

// ── Payload size check ──────────────────────────────────────────────────────
$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 2048) {
  http_response_code(413);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
  sec_audit('invalid_json', ['endpoint' => 'passport', 'len' => strlen($raw)]);
  http_response_code(400);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

// ── Input sanitization & validation ─────────────────────────────────────────
$email     = sec_sanitize($payload['email'] ?? '', 120);
$birthDate = sec_sanitize($payload['birthDate'] ?? '', 10);

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

// Extra: validate date is a real date
$dateParts = explode('-', $birthDate);
if (!checkdate((int)$dateParts[1], (int)$dateParts[2], (int)$dateParts[0])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Formato de data inválido.'], JSON_UNESCAPED_UNICODE);
  exit;
}

// ── Database ────────────────────────────────────────────────────────────────
try {
  $pdo = sec_connect_db();

  $stmt = $pdo->prepare('SELECT first_name, last_name, email, phone, birth_date, university, course, photo FROM leads WHERE email = :em AND birth_date = :bd LIMIT 1');
  $stmt->execute([':em' => $email, ':bd' => $birthDate]);
  $row = $stmt->fetch();

  if (!$row) {
    sec_audit('passport_not_found', ['email' => substr($email, 0, 3) . '***']);

    // Deliberate small delay to slow brute-force enumeration
    usleep(random_int(200000, 500000)); // 200-500ms

    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'Passaporte não encontrado. Verifique o email e data de nascimento.'], JSON_UNESCAPED_UNICODE);
    exit;
  }

  sec_audit('passport_accessed', ['email' => substr($email, 0, 3) . '***']);

  echo json_encode([
    'ok' => true,
    'passport' => [
      'firstName'  => $row['first_name'],
      'lastName'   => $row['last_name'],
      'email'      => $row['email'],
      'phone'      => $row['phone'],
      'birthDate'  => $row['birth_date'],
      'university' => $row['university'],
      'course'     => $row['course'],
      'photo'      => $row['photo'],
    ],
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  sec_audit('passport_error', ['error' => mb_substr($e->getMessage(), 0, 100)]);
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Erro interno.'], JSON_UNESCAPED_UNICODE);
}
