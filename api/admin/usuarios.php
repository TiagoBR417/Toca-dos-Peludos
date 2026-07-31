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

// Listamos os campos, EXCLUINDO DADOS SENSÍVEIS (senha, token)
$result = $conn->query("
    SELECT id, nome, sobrenome, email, telefone, tipo, ativo, created_at as cadastro 
    FROM usuarios 
    ORDER BY id DESC
");

if (!$result) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao buscar usuários.'], 500);
}

$usuarios = [];
while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

JsonResponse::send(['success' => true, 'message' => 'Usuários carregados.', 'data' => $usuarios], 200);