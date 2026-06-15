<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Services\JwtService;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

// Validação do Token JWT
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
    JsonResponse::send(['success' => false, 'message' => 'Sessão expirada.'], 401);
}

$dados = json_decode(file_get_contents('php://input'), true);
$acao = $dados['acao'] ?? '';
$conn = Database::getConnection();

// AÇÃO: ATUALIZAR TELEFONE
if ($acao === 'telefone') {
    $novoTelefone = $dados['telefone'] ?? '';
    
    $stmt = $conn->prepare("UPDATE usuarios SET telefone = ? WHERE email = ?");
    $stmt->bind_param("ss", $novoTelefone, $userEmail);
    
    if ($stmt->execute()) {
        JsonResponse::send(['success' => true, 'message' => 'Telefone atualizado com sucesso.']);
    } else {
        JsonResponse::send(['success' => false, 'message' => 'Erro interno ao atualizar telefone.'], 500);
    }
} 

// AÇÃO: ALTERAR SENHA
elseif ($acao === 'senha') {
    $senhaContexto = $dados['senha_atual'] ?? '';
    $novaSenhaRaw = $dados['nova_senha'] ?? '';
    
    // Busca a senha criptografada atual
    $stmtBusca = $conn->prepare("SELECT senha_hash FROM usuarios WHERE email = ?");
    $stmtBusca->bind_param("s", $userEmail);
    $stmtBusca->execute();
    $usuario = $stmtBusca->get_result()->fetch_assoc();
    
    if (!$usuario || !password_verify($senhaContexto, $usuario['senha_hash'])) {
        JsonResponse::send(['success' => false, 'message' => 'Senha atual incorreta.'], 400);
    }
    
    // Gera o novo hash seguro
    $novoHash = password_hash($novaSenhaRaw, PASSWORD_DEFAULT);
    $stmtUpdate = $conn->prepare("UPDATE usuarios SET senha_hash = ? WHERE email = ?");
    $stmtUpdate->bind_param("ss", $novoHash, $userEmail);
    
    if ($stmtUpdate->execute()) {
        JsonResponse::send(['success' => true, 'message' => 'Senha alterada com sucesso.']);
    } else {
        JsonResponse::send(['success' => false, 'message' => 'Erro ao salvar nova senha.'], 500);
    }
}