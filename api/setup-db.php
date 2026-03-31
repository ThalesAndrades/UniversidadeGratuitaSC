<?php
declare(strict_types=1);

/**
 * Database setup script — creates required tables for lead capture.
 * Run once via CLI or browser: php api/setup-db.php
 */

$localConfigPath = __DIR__ . DIRECTORY_SEPARATOR . 'config.local.php';
if (is_file($localConfigPath)) {
  $config = require $localConfigPath;
} else {
  $config = [
    'db_host' => 'localhost',
    'db_name' => 'u525832347_passaporte',
    'db_user' => 'u525832347_acafe',
    'db_pass' => '@PassAcafe!2026',
  ];
}

$dsn = 'mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'] . ';charset=utf8mb4';

try {
  $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  echo "Connected to database: " . $config['db_name'] . "\n";

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

  // Show existing lead count
  $count = $pdo->query("SELECT COUNT(*) as cnt FROM leads")->fetch();
  echo "\nTotal leads captured: " . $count['cnt'] . "\n";

  // Show recent leads
  $recent = $pdo->query("SELECT id, created_at, first_name, last_name, email, university, course FROM leads ORDER BY id DESC LIMIT 10")->fetchAll();
  if (count($recent) > 0) {
    echo "\nLast " . count($recent) . " leads:\n";
    foreach ($recent as $r) {
      echo "  #{$r['id']} {$r['created_at']} — {$r['first_name']} {$r['last_name']} ({$r['email']}) → {$r['university']} / {$r['course']}\n";
    }
  } else {
    echo "\nNo leads captured yet.\n";
  }

} catch (Throwable $e) {
  echo "ERROR: " . $e->getMessage() . "\n";
  exit(1);
}
