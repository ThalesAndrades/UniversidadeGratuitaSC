CREATE TABLE IF NOT EXISTS universities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  university_key VARCHAR(120) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_university_key (university_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  university_id INT UNSIGNED NOT NULL,
  course_key VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_course (university_id, course_key),
  KEY idx_university_id (university_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE leads
  ADD COLUMN university_id INT UNSIGNED NULL,
  ADD COLUMN course_id INT UNSIGNED NULL;

ALTER TABLE leads
  ADD KEY idx_university_id (university_id),
  ADD KEY idx_course_id (course_id);

INSERT INTO universities (university_key, name)
SELECT DISTINCT l.university, l.university
FROM leads l
WHERE l.university IS NOT NULL AND l.university <> ''
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO courses (university_id, course_key, name)
SELECT DISTINCT u.id, LOWER(TRIM(l.course)), l.course
FROM leads l
JOIN universities u ON u.university_key = l.university
WHERE l.course IS NOT NULL AND l.course <> ''
ON DUPLICATE KEY UPDATE name = VALUES(name);

UPDATE leads l
JOIN universities u ON u.university_key = l.university
JOIN courses c ON c.university_id = u.id AND c.course_key = LOWER(TRIM(l.course))
SET l.university_id = u.id,
    l.course_id = c.id
WHERE l.university_id IS NULL OR l.course_id IS NULL;

