<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

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

$pet_id = isset($dados['pet_id']) ? (int) $dados['pet_id'] : 0;
$nome_interessado = trim($dados['nome_interessado'] ?? '');
$email_interessado = trim($dados['email_interessado'] ?? '');
$telefone_interessado = trim($dados['telefone_interessado'] ?? '');
$data_visita = trim($dados['data_visita'] ?? '');
$horario_visita = trim($dados['horario_visita'] ?? '');
$observacoes = trim($dados['observacoes'] ?? '');

if (
    $pet_id <= 0 ||
    $nome_interessado === '' ||
    $email_interessado === '' ||
    $telefone_interessado === '' ||
    $data_visita === '' ||
    $horario_visita === ''
) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Campos obrigatórios: pet_id, nome_interessado, email_interessado, telefone_interessado, data_visita e horario_visita',
        'data' => null,
    ], 400);
}

if (!filter_var($email_interessado, FILTER_VALIDATE_EMAIL)) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Email inválido',
        'data' => null,
    ], 400);
}

$dataValida = \DateTime::createFromFormat('Y-m-d', $data_visita);
if (!$dataValida || $dataValida->format('Y-m-d') !== $data_visita) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Data inválida. Use o formato YYYY-MM-DD',
        'data' => null,
    ], 400);
}

$horarioValido = \DateTime::createFromFormat('H:i:s', $horario_visita);
if (!$horarioValido || $horarioValido->format('H:i:s') !== $horario_visita) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Horário inválido. Use o formato HH:MM:SS',
        'data' => null,
    ], 400);
}

$stmtPet = $conn->prepare("SELECT id, status FROM pets WHERE id = ?");
$stmtPet->bind_param("i", $pet_id);
$stmtPet->execute();
$resultPet = $stmtPet->get_result();

if ($resultPet->num_rows === 0) {
    $stmtPet->close();

    JsonResponse::send([
        'success' => false,
        'message' => 'Pet não encontrado',
        'data' => null,
    ], 404);
}

$pet = $resultPet->fetch_assoc();
$stmtPet->close();

if ($pet['status'] !== 'disponivel') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Esse pet não está disponível para visita',
        'data' => null,
    ], 400);
}

$sqlCheck = "
  SELECT COUNT(*) as total 
  FROM agendamentos_visita 
  WHERE pet_id = ? 
  AND data_visita = ? 
  AND horario_visita = ?
";

$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("iss", $pet_id, $data_visita, $horario_visita);
$stmtCheck->execute();

$resultCheck = $stmtCheck->get_result()->fetch_assoc();

if ($resultCheck['total'] > 0) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Este horário já está reservado para este pet.',
        'data' => null,
    ], 409);
}

$hoje = date('Y-m-d');

if ($data_visita < $hoje) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Não é possível agendar para datas passadas.',
        'data' => null,
    ], 400);
}


$stmt = $conn->prepare("
    INSERT INTO agendamentos_visita
    (pet_id, nome_interessado, email_interessado, telefone_interessado, data_visita, horario_visita, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issssss",
    $pet_id,
    $nome_interessado,
    $email_interessado,
    $telefone_interessado,
    $data_visita,
    $horario_visita,
    $observacoes
);

if (!$stmt->execute()) {
    $stmt->close();

    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao salvar agendamento',
        'data' => null,
    ], 500);
}

$id = $conn->insert_id;
$stmt->close();

JsonResponse::send([
    'success' => true,
    'message' => 'Agendamento realizado com sucesso',
    'data' => [
        'id' => $id,
    ],
], 201);