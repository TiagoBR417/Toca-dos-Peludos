<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    JsonResponse::send([
        'success' => false,
        'message' => 'Método não permitido. Use POST.',
        'data' => null,
    ], 405);
}

$conn = Database::getConnection();
$dados = Request::json();

// 1. Capturando todos os dados (antigos e novos)
$nome = trim($dados['nome'] ?? '');
$sobrenome = trim($dados['sobrenome'] ?? '');
$data_nascimento = trim($dados['data_nascimento'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$email = trim($dados['email'] ?? '');
$genero = trim($dados['genero'] ?? '');
$senha = trim($dados['senha'] ?? '');
$cpf = trim($dados['cpf'] ?? '');               // <-- Capturando CPF
$cep = trim($dados['cep'] ?? '');
$endereco = trim($dados['endereco'] ?? '');
$numero = trim($dados['numero'] ?? '');
$complemento = trim($dados['complemento'] ?? ''); // <-- Capturando Complemento
$cidade = trim($dados['cidade'] ?? '');
$estado = trim($dados['estado'] ?? '');

// 2. Verificando se algum campo obrigatório está vazio (complemento fica de fora pois é opcional)
if (
    $nome === '' || $sobrenome === '' || $data_nascimento === '' ||
    $telefone === '' || $email === '' || $genero === '' || $senha === '' ||
    $cpf === '' || $cep === '' || $endereco === '' || $numero === '' || 
    $cidade === '' || $estado === ''
) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Preencha todos os campos obrigatórios.',
        'data' => null,
    ], 400);
}

// 3. Validando formato do email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Email inválido.',
        'data' => null,
    ], 400);
}

// 4. Verificando se o email já existe no banco
$stmtCheck = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Este email já está cadastrado.',
        'data' => null,
    ], 409);
}

// 5. Preparando dados finais para inserção
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);
$tipo = 'adotante';

// 6. Inserindo no banco de dados com os novos campos inclusos
$stmt = $conn->prepare("
    INSERT INTO usuarios
    (nome, sobrenome, data_nascimento, telefone, email, genero, senha_hash, tipo, cpf, cep, endereco, numero, complemento, cidade, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Agora são 15 "s" para as 15 variáveis de string mapeadas na ordem do INSERT acima
$stmt->bind_param(
    "sssssssssssssss",
    $nome,
    $sobrenome,
    $data_nascimento,
    $telefone,
    $email,
    $genero,
    $senha_hash,
    $tipo,
    $cpf,
    $cep,
    $endereco,
    $numero,
    $complemento,
    $cidade,
    $estado
);

if (!$stmt->execute()) {
    JsonResponse::send([
        'success' => false,
        'message' => 'Erro ao cadastrar usuário.',
        'data' => null,
    ], 500);
}

// 7. Retornando sucesso
JsonResponse::send([
    'success' => true,
    'message' => 'Cadastro realizado com sucesso!',
    'data' => [
        'id' => $conn->insert_id
    ],
], 201);