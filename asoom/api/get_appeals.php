<?php
require_once '../config.php';

$userId = $_GET['userId'];

try {
    $stmt = $pdo->prepare("SELECT * FROM appeals WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $appeals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($appeals);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при получении обращений: ' . $e->getMessage()]);
}
?>