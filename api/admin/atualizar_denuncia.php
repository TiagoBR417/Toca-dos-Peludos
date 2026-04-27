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
$id = (int)($dados['id'] ?? 0);
$status = trim($dados['status'] ?? '');

// 1. Verifica se falta algo
if ($id <= 0 || $status === '') {
    JsonResponse::send(['success' => false, 'message' => 'Dados incompletos.'], 400);
}

// 2. Whitelist de segurança
$statusPermitidos = ['pendente', 'em_analise', 'resolvido', 'arquivado'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido ou não permitido.'], 400);
}

$stmt = $conn->prepare("UPDATE denuncias SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    JsonResponse::send(['success' => true, 'message' => 'Denúncia atualizada.']);
} else {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar.'], 500);
}