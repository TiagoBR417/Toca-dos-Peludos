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

$nome = htmlspecialchars(strip_tags(trim($dados['nome'] ?? '')), ENT_QUOTES, 'UTF-8');
$tipo = htmlspecialchars(strip_tags(trim($dados['tipo'] ?? '')), ENT_QUOTES, 'UTF-8');
$porte = htmlspecialchars(strip_tags(trim($dados['porte'] ?? '')), ENT_QUOTES, 'UTF-8');
$cor = htmlspecialchars(strip_tags(trim($dados['cor'] ?? '')), ENT_QUOTES, 'UTF-8');
$idade = isset($dados['idade']) && $dados['idade'] !== '' ? (int)$dados['idade'] : null;
$cidade = htmlspecialchars(strip_tags(trim($dados['cidade'] ?? '')), ENT_QUOTES, 'UTF-8');
$bairro = htmlspecialchars(strip_tags(trim($dados['bairro'] ?? '')), ENT_QUOTES, 'UTF-8');
$status = trim($dados['status'] ?? 'disponivel');
$descricao = htmlspecialchars(strip_tags(trim($dados['descricao'] ?? '')), ENT_QUOTES, 'UTF-8');

if ($nome === '' || $tipo === '' || $cidade === '' || $bairro === '') {
    JsonResponse::send(['success' => false, 'message' => 'Nome, Espécie, Cidade e Bairro são obrigatórios.'], 400);
}

$statusPermitidos = ['disponivel', 'adotado', 'em_tratamento', 'lar_temporario'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido.'], 400);
}

$stmt = $conn->prepare("INSERT INTO pets (nome, tipo, porte, cor, idade, cidade, bairro, status, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssissss", $nome, $tipo, $porte, $cor, $idade, $cidade, $bairro, $status, $descricao);

if ($stmt->execute()) {
    JsonResponse::send(['success' => true, 'message' => 'Pet cadastrado com sucesso!']);
} else {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao salvar pet no banco.'], 500);
}