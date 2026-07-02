<?php
// Database configuration for Docker or XAMPP
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'personal_website');

// Create connection
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Set JSON header for API responses
function setJSONHeader() {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Initialize database tables
function initDatabase() {
    $conn = getDBConnection();
    
    // Create database if it doesn't exist
    $conn->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    $conn->select_db(DB_NAME);
    
    // Create projects table
    $conn->query("CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(500),
        image_url VARCHAR(500),
        technologies VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    // Create socials table
    $conn->query("CREATE TABLE IF NOT EXISTS socials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        platform VARCHAR(50) NOT NULL UNIQUE,
        url VARCHAR(500) NOT NULL,
        icon VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    // Create profile table
    $conn->query("CREATE TABLE IF NOT EXISTS profile (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        bio TEXT,
        education TEXT,
        profile_image VARCHAR(500),
        interests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    // Insert default profile if it doesn't exist
    $result = $conn->query("SELECT COUNT(*) as count FROM profile");
    $row = $result->fetch_assoc();
    if ($row['count'] == 0) {
        $interests = json_encode(['music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym']);
        $conn->query("INSERT INTO profile (name, title, bio, education, profile_image, interests) 
                     VALUES ('josh cabradilla', 'aspiring front end engineer, fresh grad BSIT student', 
                     'aspiring front end engineer, fresh grad BSIT student', 
                     'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)',
                     'assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg', '$interests')");
    }
    
    // Insert default socials if they don't exist
    $result = $conn->query("SELECT COUNT(*) as count FROM socials");
    $row = $result->fetch_assoc();
    if ($row['count'] == 0) {
        $conn->query("INSERT INTO socials (platform, url, icon) VALUES 
                     ('github', 'https://github.com/Josh2240', 'assets/github.png'),
                     ('instagram', 'https://www.instagram.com/enji_adachi/', 'assets/instagram.png'),
                     ('facebook', 'https://www.facebook.com/joshua.cabradilla.946/', 'assets/facebook.png')");
    }
    
    $conn->close();
}

// Initialize on first load
initDatabase();
?>

