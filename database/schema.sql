-- Database schema for Personal Website
-- This file is automatically run when Docker initializes MySQL

USE personal_website;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(500),
    image_url VARCHAR(500),
    technologies VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Socials table
CREATE TABLE IF NOT EXISTS socials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    education TEXT,
    profile_image VARCHAR(500),
    interests JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data
INSERT INTO profile (name, title, bio, education, profile_image, interests)
VALUES (
    'josh cabradilla',
    'aspiring front end engineer, fresh grad BSIT student',
    'aspiring front end engineer, fresh grad BSIT student',
    'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)',
    'assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg',
    JSON_ARRAY('music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym')
);

INSERT INTO socials (platform, url, icon) VALUES
('github', 'https://github.com/Josh2240', 'assets/github.png'),
('instagram', 'https://www.instagram.com/enji_adachi/', 'assets/instagram.png'),
('facebook', 'https://www.facebook.com/joshua.cabradilla.946/', 'assets/facebook.png');

