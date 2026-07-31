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

// 1. Usuários Ativos (KPI)
$sqlAtivos = "SELECT COUNT(*) as total FROM usuarios WHERE ativo = 1";
$resAtivos = $conn->query($sqlAtivos);
$ativos = $resAtivos->fetch_assoc()['total'] ?? 0;

// 2. Crescimento (Cadastros por Mês)
$sqlCrescimento = "
    SELECT 
        MONTH(created_at) as mes,
        YEAR(created_at) as ano,
        COUNT(*) AS quantidade 
    FROM usuarios 
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY ano ASC, mes ASC
    LIMIT 12
";
$resCrescimento = $conn->query($sqlCrescimento);
$crescimentoData = [];
while($row = $resCrescimento->fetch_assoc()) { 
    $crescimentoData[] = $row; 
}

// 3. Distribuição de Perfis
$sqlDistribuicao = "SELECT tipo, COUNT(*) as quantidade FROM usuarios GROUP BY tipo";
$resDistribuicao = $conn->query($sqlDistribuicao);
$distribuicaoData = [];
while($row = $resDistribuicao->fetch_assoc()) { 
    $distribuicaoData[] = $row; 
}

JsonResponse::send([
    "success" => true,
    "data" => [
        "ativos" => $ativos,
        "crescimento" => $crescimentoData,
        "distribuicao" => $distribuicaoData
    ]
]);