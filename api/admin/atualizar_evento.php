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
$titulo = htmlspecialchars(strip_tags(trim($dados['titulo'] ?? '')), ENT_QUOTES, 'UTF-8');
$data_evento = trim($dados['data_evento'] ?? '');
$local = htmlspecialchars(strip_tags(trim($dados['local'] ?? '')), ENT_QUOTES, 'UTF-8');
$cidade = htmlspecialchars(strip_tags(trim($dados['cidade'] ?? '')), ENT_QUOTES, 'UTF-8');
$status = trim($dados['status'] ?? '');

if ($id <= 0 || $titulo === '' || $data_evento === '' || $local === '' || $status === '') {
    JsonResponse::send(['success' => false, 'message' => 'Campos obrigatórios ausentes.'], 400);
}

$statusPermitidos = ['ativo', 'encerrado', 'cancelado'];
if (!in_array($status, $statusPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Status inválido ou não permitido.'], 400);
}

$stmt = $conn->prepare("UPDATE eventos SET titulo = ?, data_evento = ?, local = ?, cidade = ?, status = ? WHERE id = ?");
$stmt->bind_param("sssssi", $titulo, $data_evento, $local, $cidade, $status, $id);

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao atualizar o evento.'], 500);
}

JsonResponse::send(['success' => true, 'message' => 'Evento atualizado com sucesso.']);