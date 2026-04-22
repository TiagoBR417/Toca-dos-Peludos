<?php

declare(strict_types=1);

use App\Support\JsonResponse;
use App\Services\JwtService;

// 1. O XAMPP gosta de esconder o cabeçalho. Vamos forçar a busca em todo o lado!
$headers = null;
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
}

$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

$token = null;
if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
    $token = trim($matches[1]);
}

// 2. Se não achar o token de jeito nenhum, bloqueia a porta
if (!$token) {
    JsonResponse::send(['success' => false, 'message' => 'Acesso negado. Token ausente.'], 401);
}

// 3. Tenta descodificar a chave VIP
try {
    $jwtService = new JwtService();
    $decoded = $jwtService->decode($token);

    if (!isset($decoded->role) || $decoded->role !== 'admin') {
        JsonResponse::send(['success' => false, 'message' => 'Acesso restrito a administradores.'], 403);
    }
} catch (\Exception $e) {
    // Se a chave for falsa ou tiver passado da validade
    JsonResponse::send(['success' => false, 'message' => 'Sessão expirada ou token inválido.'], 401);
}