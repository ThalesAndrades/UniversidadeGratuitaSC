<?php
declare(strict_types=1);

require __DIR__ . '/security.php';

header('Content-Type: application/json; charset=utf-8');
sec_response_headers();

// ── CORS ────────────────────────────────────────────────────────────────────
sec_cors_check();

// ── Method check (POST only) ────────────────────────────────────────────────
sec_method_check('POST');

// ── Rate limiting: 10 submissions per 15 min per IP ─────────────────────────
sec_enforce_rate_limit('leads', 10, 900);

// ── Payload size check (8 MB max for photo) ─────────────────────────────────
$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 8 * 1024 * 1024) {
  http_response_code(413);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
  sec_audit('invalid_json', ['len' => strlen($raw)]);
  http_response_code(400);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  exit;
}

// ── Anti-bot checks ─────────────────────────────────────────────────────────
sec_anti_bot($payload);

// ── Input sanitization ──────────────────────────────────────────────────────
$firstName  = sec_sanitize($payload['firstName'] ?? '', 50);
$lastName   = sec_sanitize($payload['lastName'] ?? '', 50);
$email      = sec_sanitize($payload['email'] ?? '', 120);
$phone      = sec_sanitize($payload['phone'] ?? '', 20);
$birthDate  = sec_sanitize($payload['birthDate'] ?? '', 10);
$university = sec_sanitize($payload['university'] ?? '', 120);
$course     = sec_sanitize($payload['course'] ?? '', 120);
$consent    = (bool)($payload['consent'] ?? false);
$photo      = is_string($payload['photo'] ?? null) ? ($payload['photo']) : '';

// ── Validate photo ──────────────────────────────────────────────────────────
$photo = sec_validate_photo($photo);

// ── Required field validation ───────────────────────────────────────────────
if ($firstName === '' || $lastName === '' || $email === '' || $phone === '' || !$consent) {
  http_response_code(204);
  exit;
}
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  http_response_code(204);
  exit;
}

// Validate birth date format if provided
if ($birthDate !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthDate)) {
  http_response_code(204);
  exit;
}

// ── Server context ──────────────────────────────────────────────────────────
$ip  = sec_sanitize($_SERVER['REMOTE_ADDR'] ?? '', 64);
$ua  = sec_sanitize($_SERVER['HTTP_USER_AGENT'] ?? '', 255);
$ref = sec_sanitize($_SERVER['HTTP_REFERER'] ?? '', 255);

// ── Database ────────────────────────────────────────────────────────────────
try {
  $pdo = sec_connect_db();

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
        ':ck'  => $courseKey,
        ':nm'  => $course,
      ]);

      $selectCourse = $pdo->prepare('SELECT id FROM courses WHERE university_id = :uid AND course_key = :ck LIMIT 1');
      $selectCourse->execute([
        ':uid' => $universityId,
        ':ck'  => $courseKey,
      ]);
      $crow = $selectCourse->fetch();
      $courseId = is_array($crow) && isset($crow['id']) ? (int)$crow['id'] : null;
    }

    $stmt = $pdo->prepare('INSERT INTO leads (created_at, ip, user_agent, referrer, first_name, last_name, email, phone, birth_date, university, course, university_id, course_id, photo, consent) VALUES (NOW(), :ip, :ua, :ref, :fn, :ln, :em, :ph, :bd, :un, :co, :uid, :cid, :ph2, :cs)');
    $stmt->execute([
      ':ip'  => $ip,
      ':ua'  => $ua,
      ':ref' => $ref,
      ':fn'  => $firstName,
      ':ln'  => $lastName,
      ':em'  => $email,
      ':ph'  => $phone,
      ':bd'  => $birthDate !== '' ? $birthDate : null,
      ':un'  => $university,
      ':co'  => $course,
      ':uid' => $universityId,
      ':cid' => $courseId,
      ':ph2' => $photo !== '' ? $photo : null,
      ':cs'  => $consent ? 1 : 0,
    ]);

    $pdo->commit();

    sec_audit('lead_created', ['email' => substr($email, 0, 3) . '***']);

  } catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();

    // Duplicate email (unique constraint violation)
    if ($e->getCode() == '23000' || strpos($e->getMessage(), 'Duplicate') !== false) {
      sec_audit('duplicate_email', ['email' => substr($email, 0, 3) . '***']);
      http_response_code(409);
      echo json_encode(['ok' => false, 'error' => 'duplicate_email', 'message' => 'Este email já possui um passaporte cadastrado. Use "Acessar Meu Passaporte" para recuperá-lo.'], JSON_UNESCAPED_UNICODE);
      exit;
    }

    // Fallback insert without university/course references
    sec_audit('lead_fallback_insert', ['error' => mb_substr($e->getMessage(), 0, 100)]);
    $stmt = $pdo->prepare('INSERT INTO leads (created_at, ip, user_agent, referrer, first_name, last_name, email, phone, birth_date, university, course, photo, consent) VALUES (NOW(), :ip, :ua, :ref, :fn, :ln, :em, :ph, :bd, :un, :co, :ph2, :cs)');
    $stmt->execute([
      ':ip'  => $ip,
      ':ua'  => $ua,
      ':ref' => $ref,
      ':fn'  => $firstName,
      ':ln'  => $lastName,
      ':em'  => $email,
      ':ph'  => $phone,
      ':bd'  => $birthDate !== '' ? $birthDate : null,
      ':un'  => $university,
      ':co'  => $course,
      ':ph2' => $photo !== '' ? $photo : null,
      ':cs'  => $consent ? 1 : 0,
    ]);
  }

  echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  sec_audit('lead_error', ['error' => mb_substr($e->getMessage(), 0, 100)]);
  http_response_code(500);
  echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
}
