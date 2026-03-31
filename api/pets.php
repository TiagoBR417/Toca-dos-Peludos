<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;

$conn = Database::getConnection();

$status = $_GET['status'] ?? null;

if ($status !== null && $status !== '') {
    $stmt = $conn->prepare("SELECT * FROM pets WHERE status = ?");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query("SELECT * FROM pets");
}

if (!$result) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao buscar pets',
        'data' => null,
    ], 500);
}

$pets = [];

while ($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

JsonResponse::send([
    'success' => true,
    'message' => 'Pets encontrados com sucesso',
    'data' => $pets,
]);