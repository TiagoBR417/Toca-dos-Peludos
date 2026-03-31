CREATE DATABASE IF NOT EXISTS toca_dos_peludos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE toca_dos_peludos;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo VARCHAR(20) NOT NULL DEFAULT 'adotante',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email)
);

CREATE TABLE IF NOT EXISTS pets (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    raca VARCHAR(100),
    porte VARCHAR(20),
    cor VARCHAR(50),
    idade INT,
    imagem_url VARCHAR(255),
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'disponivel',
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS eventos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    local VARCHAR(150) NOT NULL,
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    imagem_url VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS inscricoes_evento (
    id BIGINT NOT NULL AUTO_INCREMENT,
    evento_id BIGINT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    quantidade_pessoas INT NOT NULL DEFAULT 1,
    observacoes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmada',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_inscricoes_evento_evento_id (evento_id),
    KEY idx_inscricoes_evento_email (email),
    CONSTRAINT fk_inscricoes_evento
        FOREIGN KEY (evento_id)
        REFERENCES eventos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS denuncias (
    id BIGINT NOT NULL AUTO_INCREMENT,
    descricao TEXT NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    contato VARCHAR(150),
    anonimo TINYINT(1) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS doacoes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome_doador VARCHAR(150) NOT NULL,
    email_doador VARCHAR(150),
    valor DECIMAL(10,2) NOT NULL,
    mensagem TEXT,
    data_doacao DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS agendamentos_visita (
    id BIGINT NOT NULL AUTO_INCREMENT,
    pet_id BIGINT NOT NULL,
    nome_interessado VARCHAR(150) NOT NULL,
    email_interessado VARCHAR(150) NOT NULL,
    telefone_interessado VARCHAR(20) NOT NULL,
    data_visita DATE NOT NULL,
    horario_visita TIME NOT NULL,
    observacoes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'agendado',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_agendamentos_pet_id (pet_id),
    KEY idx_agendamentos_data_visita (data_visita),
    KEY idx_agendamentos_status (status),
    CONSTRAINT fk_agendamentos_pet
        FOREIGN KEY (pet_id)
        REFERENCES pets(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_pets_nome ON pets(nome);
CREATE INDEX idx_pets_tipo ON pets(tipo);
CREATE INDEX idx_pets_status ON pets(status);

CREATE INDEX idx_eventos_data_evento ON eventos(data_evento);
CREATE INDEX idx_eventos_status ON eventos(status);

CREATE INDEX idx_denuncias_status ON denuncias(status);

CREATE INDEX idx_doacoes_data_doacao ON doacoes(data_doacao);

/*inserts do bd atuais*/

USE toca_dos_peludos;

-- =========================================
-- USUÁRIOS
-- =========================================
INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo)
VALUES
('Administrador', 'admin@toca.com', '$2y$10$exemploHashAdmin123456789', '11999999999', 'admin'),
('João Silva', 'joao@email.com', '$2y$10$exemploHashUsuario123456', '11988888888', 'adotante');

-- =========================================
-- PETS
-- =========================================
INSERT INTO pets (nome, tipo, raca, porte, cor, idade, imagem_url, descricao, status, cidade, bairro)
VALUES
('Thor', 'cachorro', 'Vira-lata', 'grande', 'marrom', 3,
 'img/thor.jpg',
 'Cachorro muito dócil e brincalhão.',
 'disponivel', 'Guarulhos', 'Pimentas'),

('Luna', 'gato', 'Siamês', 'pequeno', 'branco', 2,
 'img/luna.jpg',
 'Gata tranquila e carinhosa.',
 'disponivel', 'Guarulhos', 'Bonsucesso'),

('Max', 'cachorro', 'Labrador', 'grande', 'preto', 5,
 'img/max.jpg',
 'Muito amigável, ótimo com crianças.',
 'adotado', 'Guarulhos', 'Cumbica');

-- =========================================
-- EVENTOS
-- =========================================
INSERT INTO eventos (titulo, descricao, data_evento, local, cidade, bairro, imagem_url, status)
VALUES
('Feira de Adoção - Centro', 
 'Venha conhecer nossos pets disponíveis para adoção.',
 '2026-04-10',
 'Praça Central',
 'Guarulhos',
 'Centro',
 'img/evento1.jpg',
 'ativo'),

('Evento de Adoção - Parque Cecap',
 'Evento com vários animais resgatados prontos para adoção.',
 '2026-04-20',
 'Parque Cecap',
 'Guarulhos',
 'Cecap',
 'img/evento2.jpg',
 'ativo');

-- =========================================
-- INSCRIÇÕES EM EVENTOS
-- =========================================
INSERT INTO inscricoes_evento (evento_id, nome, email, telefone, quantidade_pessoas, observacoes)
VALUES
(1, 'Carlos Oliveira', 'carlos@email.com', '11977777777', 2, 'Levarei minha família'),
(1, 'Ana Souza', 'ana@email.com', '11966666666', 1, NULL),
(2, 'Mariana Lima', 'mariana@email.com', '11955555555', 3, 'Interessada em adotar gato');

-- =========================================
-- DENÚNCIAS
-- =========================================
INSERT INTO denuncias (descricao, localizacao, contato, anonimo, status)
VALUES
('Animal abandonado em situação de risco.',
 'Rua das Flores, 123 - Guarulhos',
 '11944444444',
 0,
 'pendente'),

('Cachorro preso sem comida.',
 'Av. Brasil, 456 - Guarulhos',
 NULL,
 1,
 'em_analise');

-- =========================================
-- DOAÇÕES
-- =========================================
INSERT INTO doacoes (nome_doador, email_doador, valor, mensagem, data_doacao)
VALUES
('Fernando Alves', 'fernando@email.com', 50.00, 'Ajuda para ração', CURDATE()),
('Beatriz Costa', 'beatriz@email.com', 120.00, 'Para cuidados veterinários', CURDATE());

-- =========================================
-- AGENDAMENTOS DE VISITA
-- =========================================
INSERT INTO agendamentos_visita (
    pet_id,
    nome_interessado,
    email_interessado,
    telefone_interessado,
    data_visita,
    horario_visita,
    observacoes,
    status
)
VALUES
(1, 'Lucas Pereira', 'lucas@email.com', '11933333333', '2026-04-05', '14:00:00', 'Quer conhecer o Thor', 'agendado'),

(2, 'Juliana Rocha', 'juliana@email.com', '11922222222', '2026-04-06', '10:30:00', 'Interesse na Luna', 'agendado');