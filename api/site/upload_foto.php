<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Services\JwtService;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

// 1. Extração e validação do Token JWT
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
    JsonResponse::send(['success' => false, 'message' => 'Acesso não autorizado.'], 401);
}

try {
    $jwtService = new JwtService();
    $decoded = $jwtService->decode($token);
    $userEmail = $decoded->email;
} catch (\Exception $e) {
    JsonResponse::send(['success' => false, 'message' => 'Sessão expirada.'], 401);
}

// 2. Validação do arquivo enviado
if (!isset($_FILES['foto_perfil']) || $_FILES['foto_perfil']['error'] !== UPLOAD_ERR_OK) {
    // Tratamento para caso o arquivo seja maior que o limite do XAMPP (geralmente 2MB)
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_INI_SIZE) {
        JsonResponse::send(['success' => false, 'message' => 'A imagem é muito grande. O limite máximo é 2MB.'], 400);
    }
    JsonResponse::send(['success' => false, 'message' => 'Nenhum arquivo recebido ou falha no envio.'], 400);
}

$arquivo = $_FILES['foto_perfil'];

// Validação de extensão
$extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
$extensoesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($extensao, $extensoesPermitidas)) {
    JsonResponse::send(['success' => false, 'message' => 'Formato inválido. Envie JPG, PNG ou WEBP.'], 400);
}

// Validação profunda de segurança (Substituído finfo_open por getimagesize para evitar bugs no XAMPP)
$infoImagem = getimagesize($arquivo['tmp_name']);
if ($infoImagem === false) {
    JsonResponse::send(['success' => false, 'message' => 'O arquivo enviado não é uma imagem válida.'], 400);
}

$mimeReal = $infoImagem['mime'];
$mimesPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($mimeReal, $mimesPermitidos)) {
    JsonResponse::send(['success' => false, 'message' => 'Formato interno não suportado.'], 400);
}

// 3. Organização do diretório físico
$diretorioDestino = __DIR__ . '/../../uploads/perfil/';
if (!is_dir($diretorioDestino)) {
    mkdir($diretorioDestino, 0777, true);
}

$novoNomeArquivo = uniqid('perfil_', true) . '.' . $extensao;
$caminhoFisicoCompleto = $diretorioDestino . $novoNomeArquivo;

// 4. Move o arquivo e salva no Banco
if (move_uploaded_file($arquivo['tmp_name'], $caminhoFisicoCompleto)) {
    $caminhoRelativoBD = 'uploads/perfil/' . $novoNomeArquivo;
    
    $conn = Database::getConnection();
    $stmt = $conn->prepare("UPDATE usuarios SET foto_url = ? WHERE email = ?");
    $stmt->bind_param("ss", $caminhoRelativoBD, $userEmail);
    
    if ($stmt->execute()) {
        JsonResponse::send([
            'success' => true,
            'message' => 'Foto atualizada.',
            'url_foto' => $caminhoRelativoBD
        ], 200);
    } else {
        JsonResponse::send(['success' => false, 'message' => 'Erro ao salvar no banco.'], 500);
    }
} else {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao processar o arquivo no servidor.'], 500);
}