<?php
header("Content-Type: application/json");
require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("INSERT INTO appeals (user_id, name, email, phone, category, description, status) 
                          VALUES (?, ?, ?, ?, ?, ?, 'Принято в работу')");
    $stmt->execute([
        $data['userId'],
        $data['name'],
        $data['email'],
        $data['phone'],
        $data['category'],
        $data['description']
    ]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>