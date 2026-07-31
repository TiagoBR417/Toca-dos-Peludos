<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

$conn = Database::getConnection();

// 1. Agendamentos por Mês
$sqlMes = "
    SELECT 
        MONTH(data_visita) as mes,
        YEAR(data_visita) as ano,
        COUNT(*) AS quantidade 
    FROM agendamentos_visita 
    WHERE data_visita IS NOT NULL
    GROUP BY YEAR(data_visita), MONTH(data_visita)
    ORDER BY ano ASC, mes ASC
    LIMIT 12
";
$resMes = $conn->query($sqlMes);
$dadosMes = [];
while($row = $resMes->fetch_assoc()) { 
    $dadosMes[] = $row; 
}

// 2. Fluxo por Horário (Dia da Semana e Hora)
// No MySQL, DAYOFWEEK retorna: 1=Dom, 2=Seg, 3=Ter, 4=Qua, 5=Qui, 6=Sex, 7=Sáb
$sqlFluxo = "
    SELECT 
        DAYOFWEEK(data_visita) as dia_semana, 
        HOUR(horario_visita) as hora,
        COUNT(*) as quantidade
    FROM agendamentos_visita
    WHERE data_visita IS NOT NULL AND horario_visita IS NOT NULL
    GROUP BY dia_semana, hora
";
$resFluxo = $conn->query($sqlFluxo);
$dadosFluxo = [];
while($row = $resFluxo->fetch_assoc()) { 
    $dadosFluxo[] = $row; 
}

JsonResponse::send([
    "success" => true,
    "data" => [
        "meses" => $dadosMes,
        "fluxo" => $dadosFluxo
    ]
]);
