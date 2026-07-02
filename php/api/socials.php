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
        $result = $conn->query("SELECT * FROM socials WHERE id=$id");
        
        if ($result->num_rows > 0) {
            $social = $result->fetch_assoc();
            echo json_encode(['success' => true, 'data' => $social]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Social not found']);
        }
    } else {
        $result = $conn->query("SELECT * FROM socials ORDER BY platform");
        $socials = [];
        while ($row = $result->fetch_assoc()) {
            $socials[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $socials]);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $platform = $data['platform'] ?? '';
    $url = $data['url'] ?? '';
    $icon = $data['icon'] ?? '';
    
    // Check if platform exists
    $result = $conn->query("SELECT * FROM socials WHERE platform='$platform'");
    
    if ($result->num_rows > 0) {
        // Update existing
        $stmt = $conn->prepare("UPDATE socials SET url=?, icon=? WHERE platform=?");
        $stmt->bind_param("sss", $url, $icon, $platform);
        $stmt->execute();
        $stmt->close();
        
        $result = $conn->query("SELECT * FROM socials WHERE platform='$platform'");
        $social = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $social]);
    } else {
        // Create new
        $stmt = $conn->prepare("INSERT INTO socials (platform, url, icon) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $platform, $url, $icon);
        $stmt->execute();
        $id = $conn->insert_id;
        $stmt->close();
        
        $result = $conn->query("SELECT * FROM socials WHERE id=$id");
        $social = $result->fetch_assoc();
        http_response_code(201);
        echo json_encode(['success' => true, 'data' => $social]);
    }
} elseif ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    
    $stmt = $conn->prepare("DELETE FROM socials WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Social deleted successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Social not found']);
    }
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
?>

