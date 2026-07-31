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

// 1. Dados de Denúncias por Tipo
$sqlTipo = "SELECT tipo, COUNT(*) AS quantidade FROM denuncias GROUP BY tipo";
$resTipo = $conn->query($sqlTipo);
$tipoData = [];
while($row = $resTipo->fetch_assoc()) { 
    $tipoData[] = $row; 
}

// 2. Dados de Status das Denúncias
$sqlStatus = "SELECT status, COUNT(*) AS quantidade FROM denuncias GROUP BY status";
$resStatus = $conn->query($sqlStatus);
$statusData = [];
while($row = $resStatus->fetch_assoc()) { 
    $statusData[] = $row; 
}

JsonResponse::send([
    "success" => true,
    "data" => [
        "tipos" => $tipoData,
        "status" => $statusData
    ]
]);