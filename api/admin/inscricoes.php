<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.', 'data' => null], 405);
}

$conn = Database::getConnection();

$result = $conn->query("
    SELECT i.id, e.titulo as evento, i.nome, i.telefone, i.quantidade_pessoas, i.status
    FROM inscricoes_evento i
    LEFT JOIN eventos e ON i.evento_id = e.id
    ORDER BY i.created_at DESC
");

if (!$result) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao buscar inscrições.', 'data' => null], 500);
}

$inscricoes = [];
while ($row = $result->fetch_assoc()) {
    $inscricoes[] = $row;
}

JsonResponse::send(['success' => true, 'message' => 'Inscrições carregadas.', 'data' => $inscricoes], 200);