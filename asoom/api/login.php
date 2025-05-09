<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';

// Убедитесь, что нет вывода до этого места!
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Неверные данные']));
}

try {
    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        die(json_encode(['error' => 'Неверный email или пароль']));
    }

    die(json_encode(['success' => true, 'userId' => $user['id']]));
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Ошибка сервера']));
}
?>