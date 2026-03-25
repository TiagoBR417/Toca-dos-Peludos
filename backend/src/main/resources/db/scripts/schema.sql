CREATE TABLE IF NOT EXISTS tb_pets (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100),
    tipo VARCHAR(50),
    raca VARCHAR(100),
    porte VARCHAR(20),
    cor VARCHAR(50),
    imagemUrl VARCHAR(255),
    descricao TEXT,
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS doacao (
    id BIGSERIAL PRIMARY KEY,
    nomeDoador VARCHAR(150),
    emailDoador VARCHAR(150),
    valor DOUBLE PRECISION,
    dataDoacao DATE
);

CREATE TABLE IF NOT EXISTS tb_voluntarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150),
    email VARCHAR(150),
    telefone VARCHAR(50),
    motivos TEXT,
    competencias TEXT
);

CREATE TABLE IF NOT EXISTS tb_denuncias (
    id BIGSERIAL PRIMARY KEY,
    descricao TEXT,
    localizacao VARCHAR(255),
    contato VARCHAR(150),
    anonimo BOOLEAN
);

CREATE TABLE IF NOT EXISTS tb_eventos (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150),
    data DATE,
    local VARCHAR(150),
    descricao TEXT,
    parceiro BOOLEAN
);

CREATE TABLE IF NOT EXISTS tb_usuarios_db (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    senha VARCHAR(150),
    endereco VARCHAR(255),
    preferencias TEXT,
    tipo VARCHAR(50)
);
