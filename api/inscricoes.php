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

if (empty($dados)) {
    JsonResponse::send([
        'success' => false,
        'message' => 'JSON inválido ou ausente',
        'data' => null,
    ], 400);
}

$evento_id = isset($dados['evento_id']) ? (int) $dados['evento_id'] : 0;
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$quantidade_pessoas = isset($dados['quantidade_pessoas']) ? (int) $dados['quantidade_pessoas'] : 1;
$observacoes = trim($dados['observacoes'] ?? '');

if ($evento_id <= 0 || $nome === '' || $email === '' || $telefone === '') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Campos obrigatórios: evento_id, nome, email e telefone',
        'data' => null,
    ], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Email inválido',
        'data' => null,
    ], 400);
}

if ($quantidade_pessoas < 1) {
    JsonResponse::send([
        'success' => false,
        'message' => 'A quantidade de pessoas deve ser no mínimo 1',
        'data' => null,
    ], 400);
}

$stmtEvento = $conn->prepare("SELECT id FROM eventos WHERE id = ?");
$stmtEvento->bind_param("i", $evento_id);
$stmtEvento->execute();
$resultEvento = $stmtEvento->get_result();

if ($resultEvento->num_rows === 0) {
    $stmtEvento->close();

    JsonResponse::send([
        'success' => false,
        'message' => 'Evento não encontrado',
        'data' => null,
    ], 404);
}

$stmtEvento->close();

$stmt = $conn->prepare("
    INSERT INTO inscricoes_evento
    (evento_id, nome, email, telefone, quantidade_pessoas, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "isssis",
    $evento_id,
    $nome,
    $email,
    $telefone,
    $quantidade_pessoas,
    $observacoes
);

if (!$stmt->execute()) {
    $stmt->close();

    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao salvar inscrição',
        'data' => null,
    ], 500);
}

$id = $conn->insert_id;
$stmt->close();

JsonResponse::send([
    'success' => true,
    'message' => 'Inscrição realizada com sucesso',
    'data' => [
        'id' => $id,
    ],
], 201);