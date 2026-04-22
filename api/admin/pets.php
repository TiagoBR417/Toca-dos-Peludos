<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Método não permitido.',
        'data' => null,
    ], 405);
}

$conn = Database::getConnection();

$result = $conn->query("
    SELECT 
        id, nome, tipo, raca, porte, cor, 
        idade, cidade, bairro, status, 
        descricao, created_at
    FROM pets
    ORDER BY id DESC
");

if (!$result) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao buscar pets.',
        'data' => null,
    ], 500);
}

$pets = [];

while ($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

JsonResponse::send([
    'success' => true,
    'message' => 'Pets carregados com sucesso.',
    'data' => $pets,
], 200);