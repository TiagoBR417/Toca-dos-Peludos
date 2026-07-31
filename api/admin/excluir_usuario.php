<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

$conn = Database::getConnection();
$dados = Request::json();
$id = (int)($dados['id'] ?? 0);

if ($id <= 0) {
    JsonResponse::send(['success' => false, 'message' => 'ID inválido.'], 400);
}

$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $id);

try {
    if ($stmt->execute()) {
        JsonResponse::send(['success' => true, 'message' => 'Usuário excluído.']);
    } else {
        JsonResponse::send(['success' => false, 'message' => 'Erro ao excluir.'], 500);
    }
} catch (\Exception $e) {
    JsonResponse::send(['success' => false, 'message' => 'Não é possível excluir devido a dependências ou registros ativos no banco.'], 400);
}