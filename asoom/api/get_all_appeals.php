<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';

session_start();
if ($_SESSION['user_role'] !== 'worker') {
    echo json_encode(['error' => 'Доступ запрещен']);
    exit;
}

$statusFilter = isset($_GET['status']) ? $_GET['status'] : null;

try {
    $sql = "SELECT * FROM appeals";
    if ($statusFilter && $statusFilter !== 'all') {
        $sql .= " WHERE status = :status";
    }
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    if ($statusFilter && $statusFilter !== 'all') {
        $stmt->bindParam(':status', $statusFilter);
    }
    $stmt->execute();
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>