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
    SELECT id, titulo, data_evento, local, cidade, status 
    FROM eventos 
    ORDER BY data_evento DESC
");

if (!$result) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao buscar eventos.', 'data' => null], 500);
}

$eventos = [];
while ($row = $result->fetch_assoc()) {
    $eventos[] = $row;
}

JsonResponse::send(['success' => true, 'message' => 'Eventos carregados.', 'data' => $eventos], 200);