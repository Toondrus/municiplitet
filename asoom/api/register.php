<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Проверка, что email не пустой
if (empty($data['email'])) {
    echo json_encode(['error' => 'Email не может быть пустым']);
    exit;
}

try {
    // Проверка существования email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode(['error' => 'Пользователь с таким email уже существует']);
        exit;
    }

    // Регистрация нового пользователя
    $role = isset($data['worker_code']) && $data['worker_code'] === 'SECRET_CODE_123' ? 'worker' : 'user';
    
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)");
    $stmt->execute([
        $data['email'],
        password_hash($data['password'], PASSWORD_DEFAULT),
        $role
    ]);

    echo json_encode(['success' => true, 'role' => $role]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>