<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //recebe os dados
    $dados = json_decode(file_get_contents("php://input"));

    if (!empty($dados->email) && !empty($dados->senha)) {
        
        try {
            //verifica se o email já ta no BD
            $sql = "SELECT id, nome, senha_hash FROM usuarios WHERE email = :email";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':email', $dados->email);
            $stmt->execute();

        
            if ($stmt->rowCount() > 0) {
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                if (password_verify($dados->senha, $usuario['senha_hash'])) {
                    
                
                    http_response_code(200);
                    echo json_encode([
                        "mensagem" => "Login realizado com sucesso!",
                        "usuario" => [
                            "id" => $usuario['id'],
                            "nome" => $usuario['nome']
                        ]
                    ]);
                } else {
                    
                    http_response_code(401); 
                    echo json_encode(["erro" => "Senha incorreta."]);
                }
            } else {
            
                http_response_code(404); 
                echo json_encode(["erro" => "Usuário não encontrado com este e-mail."]);
            }
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["erro" => "Erro no servidor: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["erro" => "E-mail e senha são obrigatórios."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}
?>