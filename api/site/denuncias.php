<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Services\JwtService;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);
}

$conn = Database::getConnection();

// 1. Identificação Opcional do Usuário Logado via JWT (Suporta variações de caixa do Apache)
$headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$usuarioId = null;

if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
    try {
        $jwtService = new JwtService();
        $decoded = $jwtService->decode(trim($matches[1]));
        
        $stmtUser = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmtUser->bind_param("s", $decoded->email);
        $stmtUser->execute();
        $userRow = $stmtUser->get_result()->fetch_assoc();
        $usuarioId = $userRow['id'] ?? null;
    } catch (\Exception $e) {
        // Token inválido ou expirado é ignorado para permitir denúncias de visitantes/anônimos
    }
}

// Coleta de dados via $_POST (visto que o front-end agora envia FormData)
$tipo = trim($_POST['tipo'] ?? '');
$descricao = trim($_POST['descricao'] ?? '');
$localizacao = trim($_POST['localizacao'] ?? '');
$contato = trim($_POST['contato'] ?? '');
$anonimo = (int)($_POST['anonimo'] ?? 0);
$imagemUrl = null;

// Validações de campos obrigatórios
if ($tipo === '' || $descricao === '' || $localizacao === '') {
    JsonResponse::send(['success' => false, 'message' => 'Campos obrigatórios ausentes.'], 400);
}

if ($anonimo === 1) {
    $contato = null;
    $usuarioId = null; // Se for marcado como anônimo, remove o vínculo por privacidade
} else {
    if ($contato === '') {
        JsonResponse::send(['success' => false, 'message' => 'Contato é obrigatório se a denúncia não for anônima.'], 400);
    }
}

// 2. Upload Físico da Imagem da Ocorrência via $_FILES
if (isset($_FILES['imagem_ocorrencia']) && $_FILES['imagem_ocorrencia']['error'] === UPLOAD_ERR_OK) {
    $arquivo = $_FILES['imagem_ocorrencia'];
    $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
    $extensoesPermitidas = ['jpg', 'jpeg', 'png', 'webp'];

    if (in_array($extensao, $extensoesPermitidas)) {
        // Validação nativa para garantir integridade do arquivo de imagem no XAMPP
        $infoImagem = getimagesize($arquivo['tmp_name']);
        if ($infoImagem !== false) {
            $diretorioDestino = __DIR__ . '/../../uploads/denuncias/';
            if (!is_dir($diretorioDestino)) {
                mkdir($diretorioDestino, 0777, true);
            }
            
            $novoNome = uniqid('denuncia_', true) . '.' . $extensao;
            if (move_uploaded_file($arquivo['tmp_name'], $diretorioDestino . $novoNome)) {
                $imagemUrl = 'uploads/denuncias/' . $novoNome;
            }
        }
    }
}

// 3. Persistência dos Dados no Banco
$stmt = $conn->prepare("
    INSERT INTO denuncias 
    (tipo, descricao, localizacao, contato, anonimo, usuario_id, imagem_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssiis",
    $tipo,
    $descricao,
    $localizacao,
    $contato,
    $anonimo,
    $usuarioId,
    $imagemUrl
);

if (!$stmt->execute()) {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao salvar a denúncia no banco de dados.'], 500);
}

JsonResponse::send([
    'success' => true,
    'message' => 'Denúncia registrada com sucesso!',
    'data' => ['id' => $conn->insert_id]
], 201);