<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';

session_start();

// Проверяем, что пользователь - работник
if ($_SESSION['user_role'] !== 'worker') {
    http_response_code(403);
    die(json_encode(['error' => 'Доступ запрещен']));
}

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $pdo->prepare("UPDATE appeals SET status = ? WHERE id = ?");
    $stmt->execute([$data['newStatus'], $data['appealId']]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>