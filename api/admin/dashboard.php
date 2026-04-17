<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.', 'data' => null], 405);
}

$conn = Database::getConnection();

// Usamos sub-consultas (subqueries) para contar tudo em uma única viagem ao banco de dados!
$query = "
    SELECT 
        (SELECT COUNT(*) FROM pets) AS total_pets,
        (SELECT COUNT(*) FROM eventos) AS total_eventos,
        (SELECT COUNT(*) FROM denuncias) AS total_denuncias,
        (SELECT COUNT(*) FROM inscricoes_evento) AS total_inscricoes,
        (SELECT COUNT(*) FROM agendamentos_visita) AS total_agendamentos
";

$result = $conn->query($query);

if (!$result) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao buscar dados do dashboard.', 'data' => null], 500);
}

$totais = $result->fetch_assoc();

JsonResponse::send(['success' => true, 'message' => 'Totais carregados.', 'data' => $totais], 200);