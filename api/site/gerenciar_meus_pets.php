<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Services\JwtService;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

// Validação do Token
$headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = preg_match('/Bearer\s+(.+)/i', $authHeader, $matches) ? trim($matches[1]) : null;

if (!$token) {
    JsonResponse::send(['success' => false, 'message' => 'Não autorizado.'], 401);
}

try {
    $jwtService = new JwtService();
    $decoded = $jwtService->decode($token);
    $userEmail = $decoded->email;
} catch (\Exception $e) {
    JsonResponse::send(['success' => false, 'message' => 'Sessão inválida.'], 401);
}

$dados = json_decode(file_get_contents('php://input'), true);
$id = !empty($dados['id']) ? (int)$dados['id'] : null;
$nome = $dados['nome'] ?? '';
$especie = $dados['especie'] ?? 'Cachorro';
$idade = (int)($dados['idade'] ?? 0); // Mantido em anos conforme alinhado

$conn = Database::getConnection();

// 1. Descobre o ID do usuário logado pelo e-mail do Token
$stmtUser = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmtUser->bind_param("s", $userEmail);
$stmtUser->execute();
$userRow = $stmtUser->get_result()->fetch_assoc();
$usuarioId = $userRow['id'] ?? null;

if (!$usuarioId) {
    JsonResponse::send(['success' => false, 'message' => 'Usuário não encontrado.'], 404);
}

// 2. Executa o INSERT ou UPDATE na tabela unificada 'pets'
if ($id === null) {
    // Novo pet criado pelo usuário: status 'adotado' e vinculado ao seu ID
    $stmt = $conn->prepare("
        INSERT INTO pets (nome, tipo, idade, status, usuario_id) 
        VALUES (?, ?, ?, 'adotado', ?)
    ");
    $stmt->bind_param("ssii", $nome, $especie, $idade, $usuarioId);
} else {
    // Edição de pet existente: apenas se pertencer ao usuário logado
    $stmt = $conn->prepare("
        UPDATE pets 
        SET nome = ?, tipo = ?, idade = ? 
        WHERE id = ? AND usuario_id = ? AND status = 'adotado'
    ");
    $stmt->bind_param("ssiii", $nome, $especie, $idade, $id, $usuarioId);
}

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao salvar os dados do pet.'], 500);
}

// 3. Busca a lista atualizada de pets adotados por ESSE usuário para remontar a tela
$stmtLista = $conn->prepare("
    SELECT id, nome, tipo AS especie, idade 
    FROM pets 
    WHERE usuario_id = ? AND status = 'adotado' 
    ORDER BY id DESC
");
$stmtLista->bind_param("i", $usuarioId);
$stmtLista->execute();
$petsAtualizados = $stmtLista->get_result()->fetch_all(MYSQLI_ASSOC);

JsonResponse::send([
    'success' => true,
    'data' => $petsAtualizados
], 200);