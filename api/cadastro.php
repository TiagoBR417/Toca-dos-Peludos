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

$nome = trim($dados['nome'] ?? '');
$sobrenome = trim($dados['sobrenome'] ?? '');
$data_nascimento = trim($dados['data_nascimento'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$email = trim($dados['email'] ?? '');
$genero = trim($dados['genero'] ?? '');
$senha = trim($dados['senha'] ?? '');

if (
    $nome === '' ||
    $sobrenome === '' ||
    $data_nascimento === '' ||
    $telefone === '' ||
    $email === '' ||
    $genero === '' ||
    $senha === ''
) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Preencha todos os campos obrigatórios.',
        'data' => null,
    ], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Email inválido.',
        'data' => null,
    ], 400);
}

$stmtCheck = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Este email já está cadastrado.',
        'data' => null,
    ], 409);
}

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);
$tipo = 'adotante';

$stmt = $conn->prepare("
    INSERT INTO usuarios
    (nome, sobrenome, data_nascimento, telefone, email, genero, senha_hash, tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssssss",
    $nome,
    $sobrenome,
    $data_nascimento,
    $telefone,
    $email,
    $genero,
    $senha_hash,
    $tipo
);

if (!$stmt->execute()) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao cadastrar usuário.',
        'data' => null,
    ], 500);
}

JsonResponse::send([
    'success' => true,
    'message' => 'Cadastro realizado com sucesso!',
    'data' => [
        'id' => $conn->insert_id
    ],
], 201);