<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// -------------------------------------------------------------------------
// CONFIGURAÇÃO DO BANCO DE DADOS
// -------------------------------------------------------------------------
$host = "localhost";
$banco = "toca_dos_peludos"; 
$usuario_db = "root";
$senha_db = "";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8", $usuario_db, $senha_db);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Erro no banco de dados."]);
  exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $acao = $dados['acao'] ?? '';

  // ETAPA 1: SIMULAR ENVIO DE SMS
  if ($acao === 'enviar_sms') {
    $telefoneBruto = $dados['telefone'] ?? '';

    if (empty($telefoneBruto)) {
      echo json_encode(["success" => false, "message" => "Telefone é obrigatório."]);
      exit;
    }

    // REMOVE QUALQUER CARACTERE QUE NÃO SEJA NÚMERO (Ex: (11) 99999-9999 vira 11999999999)
    $telefoneApenasNumeros = preg_replace('/[^0-9]/', '', $telefoneBruto);

    // 1. Verifica se existe algum usuário com esse telefone (usando a função REPLACE do SQL para limpar o banco na busca também)
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE preg_replace(/[^0-9]/, '', telefone) = :telefone OR telefone = :telefoneOriginal");
        
    // Vamos simplificar para garantir compatibilidade com o MySQL:
    // Usaremos uma query que limpa os caracteres comuns no banco (parênteses, espaços e traços)
    $stmt = $pdo->prepare("
    SELECT id FROM usuarios 
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(telefone, '(', ''), ')', ''), '-', ''), ' ', '') = :telefone
    ");
    $stmt->execute(['telefone' => $telefoneApenasNumeros]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
      echo json_encode(["success" => false, "message" => "Este telefone não está cadastrado."]);
      exit;
    }

    // 2. Gera um código fictício de 6 dígitos
    $codigoSms = rand(100000, 999999);

    // 3. Salva no banco na linha do ID encontrado (Buscar pelo ID é 100% mais seguro e evita o erro do telefone)
    $stmtUpdate = $pdo->prepare("UPDATE usuarios SET codigo_recuperacao = :codigo WHERE id = :id");
    $stmtUpdate->execute([
      'codigo' => $codigoSms,
      'id'     => $usuario['id']
    ]);

    echo json_encode([
      "success" => true,
      "message" => "SMS enviado com sucesso! Código gerado: " . $codigoSms // Exibimos aqui para facilitar seu teste local
    ]);
  exit;
  }

  // ETAPA 2: VALIDAR O CÓDIGO DO SMS
  if ($acao === 'validar_sms') {
    $telefoneBruto = $dados['telefone'] ?? '';
    $codigoDigitado = $dados['codigo'] ?? '';

    if (empty($telefoneBruto) || empty($codigoDigitado)) {
      echo json_encode(["success" => false, "message" => "Dados incompletos."]);
      exit;
    }

    // Limpa o telefone vindo do formulário para fazer a busca correta
    $telefoneApenasNumeros = preg_replace('/[^0-9]/', '', $telefoneBruto);

    // Busca o código limpando os caracteres também na coluna do banco de dados
    $stmt = $pdo->prepare("
    SELECT codigo_recuperacao FROM usuarios 
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(telefone, '(', ''), ')', ''), '-', ''), ' ', '') = :telefone
    ");
    $stmt->execute(['telefone' => $telefoneApenasNumeros]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Trim remove possíveis espaços em branco invisíveis à volta do código
    if ($usuario && trim($usuario['codigo_recuperacao']) == trim($codigoDigitado)) {
      echo json_encode(["success" => true, "message" => "Código SMS válido!"]);
    } else {
      echo json_encode(["success" => false, "message" => "Código SMS incorreto."]);
    }
    exit;
  }

  // ETAPA 3: ATUALIZAR O EMAIL DEFINITIVO
  if ($acao === 'redefinir_email') {
    $telefoneBruto = $dados['telefone'] ?? '';
    $codigo = $dados['codigo'] ?? '';
    $novoEmail = $dados['novoEmail'] ?? '';

    if (empty($telefoneBruto) || empty($codigo) || empty($novoEmail)) {
      echo json_encode(["success" => false, "message" => "Dados insuficientes para alterar o e-mail."]);
      exit;
    }

    $telefoneApenasNumeros = preg_replace('/[^0-9]/', '', $telefoneBruto);

    // Verifica uma última vez se o código ainda bate antes de atualizar
    $stmt = $pdo->prepare("
    SELECT id, codigo_recuperacao FROM usuarios 
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(telefone, '(', ''), ')', ''), '-', ''), ' ', '') = :telefone
    ");
    $stmt->execute(['telefone' => $telefoneApenasNumeros]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || trim($usuario['codigo_recuperacao']) != trim($codigo)) {
      echo json_encode(["success" => false, "message" => "Sessão expirada ou código inválido."]);
      exit;
    }

    // Faz o UPDATE do e-mail do utilizador e limpa o token (coloca NULL) usando o ID
    $stmtUpdate = $pdo->prepare("UPDATE usuarios SET email = :email, codigo_recuperacao = NULL WHERE id = :id");
    $stmtUpdate->execute([
    'email' => $novoEmail,
    'id'    => $usuario['id']
    ]);

    echo json_encode(["success" => true, "message" => "E-mail atualizado com sucesso!"]);
    exit;
  }
}

echo json_encode(["success" => false, "message" => "Ação inválida."]);