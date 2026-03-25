<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents("php://input"));

    if (!empty($dados->nome) && !empty($dados->email) && !empty($dados->senha)) {
        
        try {
            $senha_hash = password_hash($dados->senha, PASSWORD_DEFAULT);
            $telefone = !empty($dados->telefone) ? $dados->telefone : null;

            // Query 
            $sql = "INSERT INTO usuarios (nome, sobrenome, data_nascimento, telefone, email, genero, senha_hash) 
                    VALUES (:nome, :sobrenome, :data_nascimento, :telefone, :email, :genero, :senha_hash)";
            
            $stmt = $pdo->prepare($sql);
            
            // Vincula os dados
            $stmt->bindParam(':nome', $dados->nome);
            $stmt->bindParam(':sobrenome', $dados->sobrenome);
            $stmt->bindParam(':data_nascimento', $dados->data_nascimento);
            $stmt->bindParam(':telefone', $telefone);
            $stmt->bindParam(':email', $dados->email);
            $stmt->bindParam(':genero', $dados->genero);
            $stmt->bindParam(':senha_hash', $senha_hash);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["mensagem" => "Usuário cadastrado com sucesso!"]);
            }
            
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(400);
                echo json_encode(["erro" => "Este e-mail já está cadastrado."]);
            } else {
                http_response_code(500);
                echo json_encode(["erro" => "Erro ao cadastrar usuário: " . $e->getMessage()]);
            }
        }
    } else {
        http_response_code(400);
        echo json_encode(["erro" => "Dados incompletos. Nome, e-mail e senha são obrigatórios."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}
?>