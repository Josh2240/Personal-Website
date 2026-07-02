<?php
require_once __DIR__ . '/../config/database.php';

setJSONHeader();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = getDBConnection();

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM profile ORDER BY id DESC LIMIT 1");
    
    if ($result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        // Parse interests JSON
        if ($profile['interests']) {
            $profile['interests'] = json_decode($profile['interests'], true);
        }
        echo json_encode(['success' => true, 'data' => $profile]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Profile not found']);
    }
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'] ?? '';
    $title = $data['title'] ?? '';
    $bio = $data['bio'] ?? '';
    $education = $data['education'] ?? '';
    $profile_image = $data['profile_image'] ?? '';
    $interests = isset($data['interests']) ? json_encode($data['interests']) : '';
    
    // Check if profile exists
    $result = $conn->query("SELECT id FROM profile ORDER BY id DESC LIMIT 1");
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $stmt = $conn->prepare("UPDATE profile SET name=?, title=?, bio=?, education=?, profile_image=?, interests=? WHERE id=?");
        $stmt->bind_param("ssssssi", $name, $title, $bio, $education, $profile_image, $interests, $row['id']);
        $stmt->execute();
        $stmt->close();
        
        $result = $conn->query("SELECT * FROM profile WHERE id=" . $row['id']);
        $profile = $result->fetch_assoc();
        if ($profile['interests']) {
            $profile['interests'] = json_decode($profile['interests'], true);
        }
        echo json_encode(['success' => true, 'data' => $profile]);
    } else {
        $stmt = $conn->prepare("INSERT INTO profile (name, title, bio, education, profile_image, interests) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $name, $title, $bio, $education, $profile_image, $interests);
        $stmt->execute();
        $id = $conn->insert_id;
        $stmt->close();
        
        $result = $conn->query("SELECT * FROM profile WHERE id=$id");
        $profile = $result->fetch_assoc();
        if ($profile['interests']) {
            $profile['interests'] = json_decode($profile['interests'], true);
        }
        http_response_code(201);
        echo json_encode(['success' => true, 'data' => $profile]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
?>

