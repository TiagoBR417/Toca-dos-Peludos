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
$tipo = trim($dados['tipo'] ?? '');
$ativo = (int)($dados['ativo'] ?? 1);

if ($id <= 0 || $tipo === '') {
    JsonResponse::send(['success' => false, 'message' => 'Dados incompletos.'], 400);
}

// Whitelist para segurança
if (!in_array($tipo, ['admin', 'adotante'])) {
    JsonResponse::send(['success' => false, 'message' => 'Permissão inválida.'], 400);
}

$stmt = $conn->prepare("UPDATE usuarios SET tipo = ?, ativo = ? WHERE id = ?");
$stmt->bind_param("sii", $tipo, $ativo, $id);

if ($stmt->execute()) {
    JsonResponse::send(['success' => true, 'message' => 'Usuário atualizado.']);
} else {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar.'], 500);
}