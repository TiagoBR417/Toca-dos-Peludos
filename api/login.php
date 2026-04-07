<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Método não permitido. Use POST.',
        'data' => null,
    ], 405);
}

$conn = Database::getConnection();
$dados = Request::json();

$email = trim($dados['email'] ?? '');
$senha = trim($dados['senha'] ?? '');

if ($email === '' || $senha === '') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Informe email e senha.',
        'data' => null,
    ], 400);
}

$stmt = $conn->prepare("
    SELECT id, nome, sobrenome, email, telefone, tipo, senha_hash, ativo
    FROM usuarios
    WHERE email = ?
    LIMIT 1
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Usuário não encontrado.',
        'data' => null,
    ], 404);
}

$usuario = $result->fetch_assoc();

if ((int)$usuario['ativo'] !== 1) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Usuário inativo.',
        'data' => null,
    ], 403);
}

if (!password_verify($senha, $usuario['senha_hash'])) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Senha incorreta.',
        'data' => null,
    ], 401);
}

unset($usuario['senha_hash']);

JsonResponse::send([
    'success' => true,
    'message' => 'Login realizado com sucesso!',
    'data' => $usuario,
], 200);