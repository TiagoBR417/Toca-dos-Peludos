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

// 1. Dados de Status
$sqlStatus = "SELECT status, COUNT(*) AS quantidade FROM pets GROUP BY status";
$resStatus = $conn->query($sqlStatus);
$statusData = [];
while($row = $resStatus->fetch_assoc()) { 
    $statusData[] = $row; 
}

// 2. Dados de Espécie e Porte
$sqlPorte = "SELECT tipo, porte, COUNT(*) AS quantidade FROM pets WHERE tipo IN ('cachorro', 'gato') AND porte IN ('pequeno', 'medio', 'grande') GROUP BY tipo, porte";
$resPorte = $conn->query($sqlPorte);
$porteData = [];
while($row = $resPorte->fetch_assoc()) { 
    $porteData[] = $row; 
}

// 3. Dados de Idade (Filhote: 0-1 ano, Adulto: 2-7 anos, Idoso: 8+ anos)
$sqlIdade = "
SELECT 
    SUM(CASE WHEN idade <= 1 THEN 1 ELSE 0 END) as filhote,
    SUM(CASE WHEN idade BETWEEN 2 AND 7 THEN 1 ELSE 0 END) as adulto,
    SUM(CASE WHEN idade >= 8 THEN 1 ELSE 0 END) as idoso
FROM pets WHERE idade IS NOT NULL
";
$resIdade = $conn->query($sqlIdade);
$idadeData = $resIdade->fetch_assoc();

JsonResponse::send([
    "success" => true,
    "data" => [
        "status" => $statusData,
        "portes" => $porteData,
        "idades" => $idadeData
    ]
]);