<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.', 'data' => null], 405);
}

$conn = Database::getConnection();
$dados = Request::json();

$id = isset($dados['id']) ? (int)$dados['id'] : 0;
$nome = trim($dados['nome'] ?? '');
$nome = htmlspecialchars(strip_tags(trim($dados['nome'] ?? '')), ENT_QUOTES, 'UTF-8');
$status = trim($dados['status'] ?? '');
$statusPermitidos = ['disponivel', 'adotado'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido ou não permitido.'], 400);
}
$descricao = trim($dados['descricao'] ?? '');
$descricao = htmlspecialchars(strip_tags(trim($dados['descricao'] ?? '')), ENT_QUOTES, 'UTF-8');
if ($id <= 0 || $nome === '' || $status === '') {
    JsonResponse::send(['success' => false, 'message' => 'Campos obrigatórios ausentes.', 'data' => null], 400);
}

$stmt = $conn->prepare("UPDATE pets SET nome = ?, status = ?, descricao = ? WHERE id = ?");
$stmt->bind_param("sssi", $nome, $status, $descricao, $id);

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar o pet no banco de dados.', 'data' => null], 500);
}

JsonResponse::send(['success' => true, 'message' => 'Pet atualizado com sucesso.', 'data' => null], 200);