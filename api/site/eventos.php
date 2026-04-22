<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;

$conn = Database::getConnection();

$result = $conn->query("SELECT * FROM eventos");

if (!$result) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao buscar eventos',
        'data' => null,
    ], 500);
}

$eventos = [];

while ($row = $result->fetch_assoc()) {
    $eventos[] = $row;
}

JsonResponse::send([
    'success' => true,
    'message' => 'Eventos encontrados com sucesso',
    'data' => $eventos,
]);