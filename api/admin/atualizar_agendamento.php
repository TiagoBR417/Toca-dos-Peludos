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
$status = trim($dados['status'] ?? '');

// 1. Verifica se falta algo
if ($id <= 0 || $status === '') {
    JsonResponse::send(['success' => false, 'message' => 'Campos obrigatórios ausentes.', 'data' => null], 400);
}

// 2. NOVA SEGURANÇA: Whitelist com os status exatos do seu painel HTML
$statusPermitidos = ['agendado', 'confirmada', 'concluida', 'cancelada'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido ou não permitido.', 'data' => null], 400);
}

// 3. Atualiza no banco de dados
$stmt = $conn->prepare("UPDATE agendamentos_visita SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar o agendamento no banco de dados.', 'data' => null], 500);
}

JsonResponse::send(['success' => true, 'message' => 'Agendamento atualizado com sucesso.', 'data' => null], 200);