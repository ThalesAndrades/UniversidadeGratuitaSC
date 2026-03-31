<?php
declare(strict_types=1);

/**
 * Database setup script — creates required tables for lead capture.
 * Run via CLI: php api/setup-db.php
 * Via browser: api/setup-db.php?key=<SECRET_KEY>
 */

// ── Access control: CLI only, or browser with secret key ────────────────────
$isCli = (php_sapi_name() === 'cli');
if (!$isCli) {
  $secretKey = $_GET['key'] ?? '';
  // Change this key on first use — it's a one-time migration script
  $validKey = 'acafe-setup-2026-' . md5(__DIR__);
  if ($secretKey !== $validKey) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Acesso negado.\n";
    exit;
  }
}

header('Content-Type: text/plain; charset=utf-8');

$localConfigPath = __DIR__ . DIRECTORY_SEPARATOR . 'config.local.php';
if (is_file($localConfigPath)) {
  $config = require $localConfigPath;
} else {
  // Credentials must be in config.local.php or environment variables
  $config = [
    'db_host' => getenv('LEADS_DB_HOST') ?: 'localhost',
    'db_name' => getenv('LEADS_DB_NAME') ?: '',
    'db_user' => getenv('LEADS_DB_USER') ?: '',
    'db_pass' => getenv('LEADS_DB_PASS') ?: '',
  ];
}

$dsn = 'mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'] . ';charset=utf8mb4';

try {
  $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  echo "Connected to database.\n";

  // Universities table
  $pdo->exec("
    CREATE TABLE IF NOT EXISTS universities (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      university_key VARCHAR(120) NOT NULL UNIQUE,
      name VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  ");
  echo "✓ Table 'universities' ready\n";

  // Courses table
  $pdo->exec("
    CREATE TABLE IF NOT EXISTS courses (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      university_id INT UNSIGNED NOT NULL,
      course_key VARCHAR(120) NOT NULL,
      name VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_uni_course (university_id, course_key),
      FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  ");
  echo "✓ Table 'courses' ready\n";

  // Leads table
  $pdo->exec("
    CREATE TABLE IF NOT EXISTS leads (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      created_at DATETIME NOT NULL,
      ip VARCHAR(64) DEFAULT NULL,
      user_agent VARCHAR(255) DEFAULT NULL,
      referrer VARCHAR(255) DEFAULT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(120) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      university VARCHAR(120) DEFAULT NULL,
      course VARCHAR(120) DEFAULT NULL,
      university_id INT UNSIGNED DEFAULT NULL,
      course_id INT UNSIGNED DEFAULT NULL,
      consent TINYINT(1) NOT NULL DEFAULT 1,
      INDEX idx_email (email),
      INDEX idx_created (created_at),
      INDEX idx_university (university_id),
      FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  ");
  echo "✓ Table 'leads' ready\n";

  // Migration: add birth_date, photo, and unique email constraint
  $columns = $pdo->query("SHOW COLUMNS FROM leads")->fetchAll(PDO::FETCH_COLUMN, 0);
  if (!in_array('birth_date', $columns)) {
    $pdo->exec("ALTER TABLE leads ADD COLUMN birth_date DATE DEFAULT NULL AFTER phone");
    echo "✓ Column 'birth_date' added to leads\n";
  }
  if (!in_array('photo', $columns)) {
    $pdo->exec("ALTER TABLE leads ADD COLUMN photo LONGTEXT DEFAULT NULL AFTER course_id");
    echo "✓ Column 'photo' added to leads\n";
  }

  // Add unique constraint on email (only if not already present)
  $indexes = $pdo->query("SHOW INDEX FROM leads WHERE Key_name = 'uq_email'")->fetchAll();
  if (count($indexes) === 0) {
    // Remove duplicates first (keep latest per email)
    $pdo->exec("
      DELETE l1 FROM leads l1
      INNER JOIN leads l2
      WHERE l1.email = l2.email AND l1.id < l2.id
    ");
    $pdo->exec("ALTER TABLE leads ADD UNIQUE KEY uq_email (email)");
    echo "✓ Unique constraint 'uq_email' added to leads\n";
  }

  // Show count only (no PII exposure)
  $count = $pdo->query("SELECT COUNT(*) as cnt FROM leads")->fetch();
  echo "\nTotal leads: " . $count['cnt'] . "\n";

} catch (Throwable $e) {
  if ($isCli) {
    echo "ERROR: " . $e->getMessage() . "\n";
  } else {
    echo "ERROR: Falha na execução. Verifique via CLI para detalhes.\n";
  }
  exit(1);
}
