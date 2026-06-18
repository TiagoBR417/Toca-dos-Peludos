<?php
// Configurações de cabeçalho para APIs JSON e CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclui os arquivos necessários do PHPMailer
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// -------------------------------------------------------------------------
// CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS (PDO)
// -------------------------------------------------------------------------
$host = "localhost";
$banco = "toca_dos_peludos"; // Substitua pelo nome real do seu banco de dados
$usuario_db = "root";
$senha_db = "";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$banco;charset=utf8", $usuario_db, $senha_db);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Erro na conexão com o banco de dados."]);
  exit;
}

// Captura os dados enviados via JSON pelo JavaScript
$dados = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $acao = $dados['acao'] ?? '';

  // ETAPA 1: GERAR, SALVAR E ENVIAR O CÓDIGO
  if ($acao === 'enviar_codigo') {
    $email = $dados['email'] ?? '';

    if (empty($email)) {
      echo json_encode(["success" => false, "message" => "O e-mail é obrigatório."]);
      exit;
    }

    // 1. Verifica se o usuário existe no sistema
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
      echo json_encode(["success" => false, "message" => "Este e-mail não está cadastrado no sistema."]);
      exit;
    }

    // 2. Gera um código aleatório de 6 dígitos
    $codigoVerificacao = rand(100000, 999999);

    // 3. Salva o código gerado no banco de dados para esse usuário
    $stmtUpdate = $pdo->prepare("UPDATE usuarios SET codigo_recuperacao = :codigo WHERE email = :email");
    $stmtUpdate->execute([
      'codigo' => $codigoVerificacao,
      'email' => $email
    ]);

    // 4. Configura e envia o e-mail real via PHPMailer
    $mail = new PHPMailer(true);

    try {
      $mail->isSMTP();
      $mail->Host       = 'smtp.gmail.com';
      $mail->SMTPAuth   = true;
      $mail->Username   = 'seu-email-da-ong@gmail.com'; // O seu e-mail do Gmail
      $mail->Password   = 'abcdefghijklmnop';           // A sua Senha de App de 16 dígitos sem espaços
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      $mail->Port       = 587;
      $mail->CharSet    = 'UTF-8';

      // Remetente e Destinatário
      $mail->setFrom('seu-email-da-ong@gmail.com', 'Toca dos Peludos');
      $mail->addAddress($email);

      // Conteúdo do e-mail em HTML
      $mail->isHTML(true);
      $mail->Subject = 'Código de Recuperação - Toca dos Peludos';
      $mail->Body    = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
          <h2 style='color: #7956a6;'>Recuperação de Senha</h2>
          <p>Olá! Recebemos um pedido para redefinir a sua senha na Toca dos Peludos.</p>
          <p>Use o código de verificação abaixo para continuar o processo:</p>
          <div style='background: #f4f3f8; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; letter-spacing: 5px; color: #7956a6;'>
            $codigoVerificacao
          </div>
          <p style='font-size: 12px; color: #999; margin-top: 20px;'>Se você não solicitou essa alteração, ignore este e-mail.</p>
        </div>
      ";

      $mail->send();

      echo json_encode(["success" => true, "message" => "Código enviado com sucesso!"]);
      exit;

      } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Erro ao enviar e-mail: {$mail->ErrorInfo}"]);
        exit;
      }
    }

    // ETAPA 2: VALIDAR O CÓDIGO DIGITADO
    if ($acao === 'validar_codigo') {
      $email = $dados['email'] ?? '';
      $codigoDigitado = $dados['codigo'] ?? '';

      if (empty($email) || empty($codigoDigitado)) {
        echo json_encode(["success" => false, "message" => "Dados incompletos."]);
        exit;
      }

      // Busca o código que está gravado no banco para este utilizador
      $stmt = $pdo->prepare("SELECT codigo_recuperacao FROM usuarios WHERE email = :email");
      $stmt->execute(['email' => $email]);
      $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

      // Valida se o código bate de forma exata com o guardado
      if ($usuario && $usuario['codigo_recuperacao'] == $codigoDigitado) {
        echo json_encode(["success" => true, "message" => "Código válido!"]);
      } else {
        echo json_encode(["success" => false, "message" => "Código incorreto ou inválido."]);
      }
      exit;
    }

    // ETAPA 3: ATUALIZAR A SENHA DEFINITIVA
    if ($acao === 'redefinir_senha') {
      $email = $dados['email'] ?? '';
      $codigo = $dados['codigo'] ?? '';
      $novaSenha = $dados['novaSenha'] ?? '';

      if (empty($email) || empty($codigo) || empty($novaSenha)) {
        echo json_encode(["success" => false, "message" => "Dados insuficientes para redefinir a senha."]);
        exit;
      }

      // Medida de segurança extra: Verifica novamente se o código bate antes de atualizar
      $stmt = $pdo->prepare("SELECT codigo_recuperacao FROM usuarios WHERE email = :email");
      $stmt->execute(['email' => $email]);
      $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$usuario || $usuario['codigo_recuperacao'] != $codigo) {
        echo json_encode(["success" => false, "message" => "Operação inválida ou token expirado."]);
        exit;
      }

      // 1. Criptografa a nova senha usando a função nativa e segura do PHP (Bcrypt)
      $senhaSegura = password_hash($novaSenha, PASSWORD_DEFAULT);

      // 2. Faz o UPDATE da senha e limpa o código de recuperação por segurança (colocando NULL)
      $stmtUpdate = $pdo->prepare("UPDATE usuarios SET senha = :senha, codigo_recuperacao = NULL WHERE email = :email");
      $stmtUpdate->execute([
        'senha' => $senhaSegura,
        'email' => $email
      ]);

    echo json_encode(["success" => true, "message" => "Senha redefinida com sucesso!"]);
    exit;
  }
}

// Resposta caso tentem acessar o arquivo de forma incorreta
echo json_encode(["success" => false, "message" => "Requisição inválida."]);