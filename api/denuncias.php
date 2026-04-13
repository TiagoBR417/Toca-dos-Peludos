<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Método não permitido',
        'data' => null
    ], 405);
}

$conn = Database::getConnection();
$dados = Request::json();

if (empty($dados)) {
    JsonResponse::send([
        'success' => false,
        'message' => 'JSON inválido',
        'data' => null
    ], 400);
}

// Campos
$tipo = trim($dados['tipo'] ?? '');
$descricao = trim($dados['descricao'] ?? '');
$localizacao = trim($dados['localizacao'] ?? '');
$contato = trim($dados['contato'] ?? '');
$anonimo = isset($dados['anonimo']) ? (int)$dados['anonimo'] : 0;

// Validação básica
if ($tipo === '' || $descricao === '' || $localizacao === '') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Campos obrigatórios: tipo, descricao, localizacao',
        'data' => null
    ], 400);
}

if ($anonimo === 1) {
    $contato = null;
} else {
    if ($contato === '') {
        JsonResponse::send([
            'success' => false,
            'message' => 'Contato é obrigatório se a denúncia não for anônima',
            'data' => null
        ], 400);
    }
}

// Insert
$stmt = $conn->prepare("
    INSERT INTO denuncias 
    (tipo, descricao, localizacao, contato, anonimo)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssi",
    $tipo,
    $descricao,
    $localizacao,
    $contato,
    $anonimo
);

if (!$stmt->execute()) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao salvar denúncia',
        'data' => null
    ], 500);
}

$id = $conn->insert_id;

JsonResponse::send([
    'success' => true,
    'message' => 'Denúncia enviada com sucesso',
    'data' => ['id' => $id]
], 201);