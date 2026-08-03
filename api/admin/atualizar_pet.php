<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

$conn = Database::getConnection();
$dados = Request::json();

$id = isset($dados['id']) ? (int)$dados['id'] : 0;
$nome = htmlspecialchars(strip_tags(trim($dados['nome'] ?? '')), ENT_QUOTES, 'UTF-8');
$porte = htmlspecialchars(strip_tags(trim($dados['porte'] ?? '')), ENT_QUOTES, 'UTF-8');
$cor = htmlspecialchars(strip_tags(trim($dados['cor'] ?? '')), ENT_QUOTES, 'UTF-8');
$idade = isset($dados['idade']) && $dados['idade'] !== '' ? (int)$dados['idade'] : null;
$cidade = htmlspecialchars(strip_tags(trim($dados['cidade'] ?? '')), ENT_QUOTES, 'UTF-8');
$bairro = htmlspecialchars(strip_tags(trim($dados['bairro'] ?? '')), ENT_QUOTES, 'UTF-8');
$status = trim($dados['status'] ?? '');
$descricao = htmlspecialchars(strip_tags(trim($dados['descricao'] ?? '')), ENT_QUOTES, 'UTF-8');

$statusPermitidos = ['disponivel', 'adotado', 'em_tratamento', 'lar_temporario'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido ou não permitido.'], 400);
}

if ($id <= 0 || $nome === '' || $status === '' || $cidade === '' || $bairro === '') {
    JsonResponse::send(['success' => false, 'message' => 'Campos obrigatórios ausentes.'], 400);
}

$stmt = $conn->prepare("UPDATE pets SET nome = ?, porte = ?, cor = ?, idade = ?, cidade = ?, bairro = ?, status = ?, descricao = ? WHERE id = ?");
$stmt->bind_param("sssissssi", $nome, $porte, $cor, $idade, $cidade, $bairro, $status, $descricao, $id);

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar o pet no banco de dados.'], 500);
}

JsonResponse::send(['success' => true, 'message' => 'Pet atualizado com sucesso.'], 200);