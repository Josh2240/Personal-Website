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
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $conn->query("SELECT * FROM projects WHERE id=$id");
        
        if ($result->num_rows > 0) {
            $project = $result->fetch_assoc();
            echo json_encode(['success' => true, 'data' => $project]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Project not found']);
        }
    } else {
        $result = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
        $projects = [];
        while ($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $projects]);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $title = $data['title'] ?? '';
    $description = $data['description'] ?? '';
    $link = $data['link'] ?? '';
    $image_url = $data['image_url'] ?? '';
    $technologies = $data['technologies'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO projects (title, description, link, image_url, technologies) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $title, $description, $link, $image_url, $technologies);
    $stmt->execute();
    $id = $conn->insert_id;
    $stmt->close();
    
    $result = $conn->query("SELECT * FROM projects WHERE id=$id");
    $project = $result->fetch_assoc();
    http_response_code(201);
    echo json_encode(['success' => true, 'data' => $project]);
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($_GET['id'] ?? $data['id'] ?? 0);
    
    $title = $data['title'] ?? '';
    $description = $data['description'] ?? '';
    $link = $data['link'] ?? '';
    $image_url = $data['image_url'] ?? '';
    $technologies = $data['technologies'] ?? '';
    
    $stmt = $conn->prepare("UPDATE projects SET title=?, description=?, link=?, image_url=?, technologies=? WHERE id=?");
    $stmt->bind_param("sssssi", $title, $description, $link, $image_url, $technologies, $id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        $result = $conn->query("SELECT * FROM projects WHERE id=$id");
        $project = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $project]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Project not found']);
    }
    $stmt->close();
} elseif ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    
    $stmt = $conn->prepare("DELETE FROM projects WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Project not found']);
    }
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
?>

