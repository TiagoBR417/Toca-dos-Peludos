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
    SELECT id, tipo, descricao, localizacao, 
           IF(anonimo = 1, 'Anônimo', contato) as contato, 
           status 
    FROM denuncias 
    ORDER BY created_at DESC
");

if (!$result) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao buscar denúncias.', 'data' => null], 500);
}

$denuncias = [];
while ($row = $result->fetch_assoc()) {
    $denuncias[] = $row;
}

JsonResponse::send(['success' => true, 'message' => 'Denúncias carregadas.', 'data' => $denuncias], 200);