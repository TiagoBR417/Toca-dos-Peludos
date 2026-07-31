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

// Consulta para agrupar as inscrições por mês e ano
$sql = "
    SELECT 
        MONTH(created_at) as mes,
        YEAR(created_at) as ano,
        COUNT(*) AS quantidade 
    FROM inscricoes 
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY ano ASC, mes ASC
    LIMIT 12
";

$result = $conn->query($sql);
$dados = [];

if ($result) {
    while($row = $result->fetch_assoc()) { 
        $dados[] = $row; 
    }
}

JsonResponse::send([
    "success" => true,
    "data" => $dados
]);