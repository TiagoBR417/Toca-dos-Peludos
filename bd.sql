--.pets
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    raca VARCHAR(50) NOT NULL,
    porte VARCHAR(50) NOT NULL, 
    status VARCHAR(30) DEFAULT 'DISPONÍVEL',
    imagemUrl VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--.usuario
CREATE TABLE IF NOT EXISTS usuario (
    id serial PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    genero VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL

);

--denuncias
DROP TABLE IF EXISTS denuncias;

CREATE TABLE denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    localizacao VARCHAR(255),
    contato VARCHAR(100),
    anonimo BOOLEAN DEFAULT FALSE,
    data_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insere 4 animais 
INSERT INTO pets (nome, tipo, raca, porte, status, imagemUrl) VALUES
('Rex', 'Cachorro', 'SRD (Vira-lata)', 'Médio', 'DISPONÍVEL', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'),
('Mimi', 'Gato', 'Siamês', 'Pequeno', 'DISPONÍVEL', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'),
('Thor', 'Cachorro', 'Golden Retriever', 'Grande', 'EM PROCESSO', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'),
('Luna', 'Gato', 'Persa', 'Pequeno', 'DISPONÍVEL', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80');