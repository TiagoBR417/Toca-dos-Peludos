<?php



header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");


require 'conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];


// ROTA GET
if ($metodo === 'GET') {
    try {
        //busca os animais cadastrados e ordena eles
        $sql = "SELECT id, nome, tipo, raca, porte, status, imagemUrl FROM pets ORDER BY id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        
        $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($pets);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao buscar pets: " . $e->getMessage()]);
    }
}


//rota POST
elseif ($metodo === 'POST') {
    
    $dados = json_decode(file_get_contents("php://input"));

    if(!empty($dados->nome) && !empty($dados->tipo)) {
        try {
            $sql = "INSERT INTO pets (nome, tipo, raca, porte, status, imagemUrl) 
                    VALUES (:nome, :tipo, :raca, :porte, :status, :imagemUrl)";
            $stmt = $pdo->prepare($sql);
            
            //limpa os campos
            $raca = !empty($dados->raca) ? $dados->raca : 'Desconhecida';
            $porte = !empty($dados->porte) ? $dados->porte : 'Médio';
            $status = !empty($dados->status) ? $dados->status : 'DISPONÍVEL';
            $imagemUrl = !empty($dados->imagemUrl) ? $dados->imagemUrl : null;
            
            $stmt->bindParam(':nome', $dados->nome);
            $stmt->bindParam(':tipo', $dados->tipo);
            $stmt->bindParam(':raca', $raca);
            $stmt->bindParam(':porte', $porte);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':imagemUrl', $imagemUrl);
            
            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["mensagem" => "Pet cadastrado com sucesso!"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["erro" => "Erro ao salvar o pet: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["erro" => "Dados incompletos. Nome e tipo são obrigatórios."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido."]);
}
?>