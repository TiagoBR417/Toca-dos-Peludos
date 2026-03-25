<?php
   header("Access-Control-Allow-Origin: *");
   header("Content-Type: application/json; charset=UTF-8");
   header("Access-Control-Allow-Methods: POST");

   require 'conexao.php';

   if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $dados = json_decode(file_get_contents('php://input'));

    if (!empty($dados->descricao) && !empty($dados->tipo)) {
        try {
            $sql = "INSERT INTO denuncias (tipo, descricao, localizacao, contato, anonimo) 
                    VALUES (:tipo, :descricao, :localizacao, :contato, :anonimo)";
            $stmt = $pdo->prepare($sql);
            
        
            $stmt->bindParam(':tipo', $dados->tipo);
            $stmt->bindParam(':descricao', $dados->descricao);
            $stmt->bindParam(':localizacao', $dados->localizacao);
            $stmt->bindParam(':contato', $dados->contato);
            
            $anonimo_val = $dados->anonimo ? 1 : 0;
            $stmt->bindParam(':anonimo', $anonimo_val, PDO::PARAM_INT);

            if($stmt->execute()) {
                http_response_code (200);
                echo json_encode(["erro"=> "Denúncia registrada com sucesso!"]);
              }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["erro" => "Erro ao resgistrar a denúncia"]);  
            } 
        } else {
            http_response_code(400);
            echo json_encode(["erro" => "A descrição é obrigatória"]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["erro" => "Método não permitido"]);
    }
    
    
?>