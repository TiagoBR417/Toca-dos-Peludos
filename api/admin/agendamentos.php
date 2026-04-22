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
    SELECT a.id, p.nome as nome_pet, a.nome_interessado, a.telefone_interessado, 
           a.data_visita, a.horario_visita, a.status
    FROM agendamentos_visita a
    LEFT JOIN pets p ON a.pet_id = p.id
    ORDER BY a.data_visita DESC, a.horario_visita ASC
");

if (!$result) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao buscar agendamentos.', 'data' => null], 500);
}

$agendamentos = [];
while ($row = $result->fetch_assoc()) {
    $agendamentos[] = $row;
}

JsonResponse::send(['success' => true, 'message' => 'Agendamentos carregados.', 'data' => $agendamentos], 200);