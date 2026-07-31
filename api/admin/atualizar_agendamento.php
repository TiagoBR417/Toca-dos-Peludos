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
$nome = htmlspecialchars(strip_tags(trim($dados['nome_interessado'] ?? '')), ENT_QUOTES, 'UTF-8');
$telefone = htmlspecialchars(strip_tags(trim($dados['telefone_interessado'] ?? '')), ENT_QUOTES, 'UTF-8');
$data_visita = trim($dados['data_visita'] ?? '');
$horario_visita = trim($dados['horario_visita'] ?? '');
$status = trim($dados['status'] ?? '');

// 1. Verifica se falta algo
if ($id <= 0 || $nome === '' || $data_visita === '' || $horario_visita === '' || $status === '') {
    JsonResponse::send(['success' => false, 'message' => 'Campos obrigatórios ausentes.'], 400);
}

// 2. Whitelist com os status exatos
$statusPermitidos = ['agendado', 'confirmada', 'concluida', 'cancelada'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido ou não permitido.'], 400);
}

// 3. Atualiza tudo no banco de dados
$stmt = $conn->prepare("UPDATE agendamentos_visita SET nome_interessado = ?, telefone_interessado = ?, data_visita = ?, horario_visita = ?, status = ? WHERE id = ?");
$stmt->bind_param("sssssi", $nome, $telefone, $data_visita, $horario_visita, $status, $id);

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar o agendamento no banco de dados.'], 500);
}

JsonResponse::send(['success' => true, 'message' => 'Agendamento atualizado com sucesso.']);