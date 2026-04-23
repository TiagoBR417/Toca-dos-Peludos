<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Services\JwtService;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

// 1. Procura o Token (com a proteção anti-XAMPP)
$headers = null;
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
}
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

$token = null;
if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
    $token = trim($matches[1]);
}

if (!$token) {
    JsonResponse::send(['success' => false, 'message' => 'Faça login para aceder ao perfil.'], 401);
}

// 2. Descodifica o Token para descobrir o email do utilizador
try {
    $jwtService = new JwtService();
    $decoded = $jwtService->decode($token);
    $userEmail = $decoded->email;
} catch (\Exception $e) {
    JsonResponse::send(['success' => false, 'message' => 'Sessão expirada.'], 401);
}

$conn = Database::getConnection();

// 3. Busca os Agendamentos de Visita desse email
$stmtVisitas = $conn->prepare("
    SELECT a.id, p.nome as nome_pet, a.data_visita, a.horario_visita, a.status
    FROM agendamentos_visita a
    JOIN pets p ON a.pet_id = p.id
    WHERE a.email_interessado = ?
    ORDER BY a.data_visita DESC
");
$stmtVisitas->bind_param("s", $userEmail);
$stmtVisitas->execute();
$visitas = $stmtVisitas->get_result()->fetch_all(MYSQLI_ASSOC);

// 4. Busca as Inscrições em Eventos desse email
$stmtEventos = $conn->prepare("
    SELECT i.id, e.titulo as evento_nome, e.data_evento, i.quantidade_pessoas, i.status
    FROM inscricoes_evento i
    JOIN eventos e ON i.evento_id = e.id
    WHERE i.email = ?
    ORDER BY e.data_evento DESC
");
$stmtEventos->bind_param("s", $userEmail);
$stmtEventos->execute();
$eventos = $stmtEventos->get_result()->fetch_all(MYSQLI_ASSOC);

// 5. Devolve tudo empacotado para o Frontend
JsonResponse::send([
    'success' => true,
    'data' => [
        'visitas' => $visitas,
        'eventos' => $eventos
    ]
], 200);