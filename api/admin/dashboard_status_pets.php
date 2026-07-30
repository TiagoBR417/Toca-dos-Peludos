<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;

$conn = Database::getConnection();

$sql = "
SELECT
    status,
    COUNT(*) AS quantidade
FROM pets
GROUP BY status
";

$result = $conn->query($sql);

$dados = [];

while($linha = $result->fetch_assoc()){
    $dados[] = $linha;
}

JsonResponse::send([
    "success"=>true,
    "data"=>$dados
]);