CREATE DATABASE IF NOT EXISTS toca_dos_peludos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE toca_dos_peludos;

-- ===================== --
-- 1. TABELA DE USUÁRIOS --
-- ===================== --
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  sobrenome VARCHAR(150) NOT NULL,
  data_nascimento DATE NOT NULL,
  genero VARCHAR(20) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  codigo_recuperacao VARCHAR(6) DEFAULT NULL,
  telefone VARCHAR(20) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(100),
  bairro VARCHAR (100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'adotante',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  foto_url VARCHAR(255) DEFAULT 'img/logo-tdp-ícone.png',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  UNIQUE KEY uq_usuarios_cpf (cpf)
);

-- ================= --
-- 2. TABELA DE PETS --
-- ================= --
CREATE TABLE IF NOT EXISTS pets (
  id BIGINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  raca VARCHAR(100) DEFAULT 'SRD',
  porte VARCHAR(20),
  sexo VARCHAR(10),
  cor VARCHAR(50),
  idade INT,
  castrado TINYINT(1) NOT NULL DEFAULT 0,
  vacinado TINYINT(1) NOT NULL DEFAULT 0,
  nivel_energia VARCHAR(20),
  bom_com_criancas TINYINT(1),
  bom_com_outros_pets TINYINT(1),
  imagem_url VARCHAR(255),
  descricao TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'disponivel',
  cidade VARCHAR(100),
  bairro VARCHAR(100),
  usuario_id BIGINT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_pets_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- ==================== --
-- 3. TABELA DE EVENTOS --
-- ==================== --
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

-- ======================================================== --
-- 4. INSCRIÇÕES NO EVENTO (Vinculado ao Usuário se logado) --
-- ======================================================== --
CREATE TABLE IF NOT EXISTS inscricoes_evento (
  id BIGINT NOT NULL AUTO_INCREMENT,
  evento_id BIGINT NOT NULL,
  usuario_id BIGINT NOT NULL, -- Nova FK: Se o adotante já tiver cadastro, vincula aqui automaticamente
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  quantidade_pessoas INT NOT NULL DEFAULT 1,
  observacoes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmada',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_inscricoes_evento FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_inscricoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ======================== --
-- 5. TABELAS DE DEDNÚNCIAS --
-- ======================== --
CREATE TABLE IF NOT EXISTS denuncias (
  id BIGINT NOT NULL AUTO_INCREMENT,
  tipo varchar(50) NOT NULL,
  descricao TEXT NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  contato VARCHAR(150),
  anonimo TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  usuario_id BIGINT NULL,
  imagem_url VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_denuncias_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==================== --
-- 6. TABELA DE DOAÇÕES --
-- ==================== --
CREATE TABLE IF NOT EXISTS doacoes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  usuario_id BIGINT NULL, -- Nova FK: Permite saber qual usuário logado fez a doação (se não for anônima)
  nome_doador VARCHAR(150) NOT NULL,
  email_doador VARCHAR(150),
  valor DECIMAL(10,2) NOT NULL,
  mensagem TEXT,
  data_doacao DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_doacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ========================= --
-- 7. AGENDAMENTOS DE VISITA --
-- ========================= --
CREATE TABLE IF NOT EXISTS agendamentos_visita (
  id BIGINT NOT NULL AUTO_INCREMENT,
  pet_id BIGINT NOT NULL,
  usuario_id BIGINT NULL, -- Nova FK: Vincula diretamente ao perfil do usuário interessado
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
  CONSTRAINT fk_agendamentos_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_agendamentos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ================================= --
-- 8. ÍNDICES DE PERFORMANCE (INDEX) --
-- ================================= --
CREATE INDEX idx_pets_busca ON pets(tipo, status);
CREATE INDEX idx_eventos_data_evento ON eventos(data_evento);
CREATE INDEX idx_denuncias_status ON denuncias(status);
CREATE INDEX idx_doacoes_data_doacao ON ddoacoes(data_doacao);
CREATE INDEX idx_agendamentos_data_visita ON agendamentos_visita(data_visita);

USE toca_dos_peludos;

-- ============================= --
-- 9. INSERTS DE TESTE ADAPTADOS --
-- ============================= --
INSERT INTO usuarios (nome, sobrenome, data_nascimento, genero, cpf, email, senha_hash, telefone, cep, endereco, numero, complemento, bairro, cidade, estado, tipo) VALUES
('Administrador', 'Toca', '1990-01-01', 'Masculino', '000.000.000-00', 'admin@toca.com', '$2y$10$exemploHashAdmin123456789', '11999999999', '07001-000', 'Rua Principal', '10', NULL, 'Centro', 'Guarulhos', 'SP', 'admin'),
('João', 'Silva', '1995-03-23', 'Masculino', '111.111.111-11', 'joao@email.com', '$2y$10$exemploHashUsuario123456', '11988888888', '07243-010', 'Av. das Nações', '550', 'Apto 12', 'Pimentas', 'Guarulhos', 'SP', 'adotante');

INSERT INTO pets (nome, tipo, raca, porte, sexo, cor, idade, castrado, vacinado, nivel_energia, bom_com_criancas, bom_com_outros_pets, imagem_url, descricao, status, cidade, bairro, usuario_id) VALUES
-- 1. Cachorro, Médio, Adulto, Brincalhão
('Caramelo', 'cachorro', 'SRD', 'medio', 'Macho', 'Caramelo', 3, 1, 1, 'Brincalhão', 1, 1, 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600', 'O clássico cão brasileiro. Super dócil.', 'disponivel', 'Guarulhos', 'Centro', 1),

-- 2. Gato, Pequeno, Filhote, Calmo
('Luna', 'gato', 'Siamês', 'pequeno', 'Fêmea', 'Branco e Cinza', 1, 1, 1, 'Calmo', 1, 0, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600', 'Gatinha muito mansa que adora um cafuné.', 'disponivel', 'Guarulhos', 'Bonsucesso', 1),

-- 3. Cachorro, Grande, Adulto, Atleta
('Thor', 'cachorro', 'Labrador', 'grande', 'Macho', 'Preto', 4, 1, 1, 'Atleta', 1, 1, 'https://images.unsplash.com/photo-1599508704512-2f19efd1e40f?q=80&w=600', 'Protetor, brincalhão e extremamente companheiro.', 'disponivel', 'São Paulo', 'Penha', 1),

-- 4. Gato, Pequeno, Adulto, Calmo
('Mia', 'gato', 'Persa', 'pequeno', 'Fêmea', 'Branca', 2, 1, 1, 'Calmo', 0, 1, 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=600&auto=format&fit=crop', 'Uma verdadeira princesa, muito silenciosa e independente. Convive bem com outros gatos, mas não gosta de muito barulho.', 'disponivel', 'Guarulhos', 'Cecap', 1),

-- 5. Cachorro, Pequeno, Idoso, Calmo
('Rex', 'cachorro', 'SRD', 'pequeno', 'Macho', 'Preto e Branco', 9, 1, 1, 'Calmo', 1, 1, 'https://images.unsplash.com/photo-1537151608804-ea2aa1427189?q=80&w=600&auto=format&fit=crop', 'Um idosinho resgatado das ruas que só quer uma caminha quente e um lar tranquilo para descansar. Muito dócil e silencioso.', 'disponivel', 'Guarulhos', 'Pimentas', 1),

-- 6. Cachorro, Pequeno, Filhote, Brincalhão
('Mel', 'cachorro', 'Poodle', 'pequeno', 'Fêmea', 'Branca', 0, 0, 0, 'Brincalhão', 1, 1, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop', 'Uma filhotinha cheia de energia! Adora morder brinquedos, explorar a casa inteira e receber carinho na barriga.', 'disponivel', 'Guarulhos', 'Macedo', 1),

-- 7. Cachorro, Médio, Jovem, Atleta
('Pipoca', 'cachorro', 'SRD', 'medio', 'Macho', 'Branco e Amarelo', 1, 1, 1, 'Atleta', 1, 1, 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600&auto=format&fit=crop', 'Energia pura! Corre super rápido, adora brincar com outros cães no parque e aprende comandos muito fácil.', 'disponivel', 'Guarulhos', 'Taboão', 1),

-- 8. Gato, Pequeno, Filhote, Brincalhão
('Oliver', 'gato', 'SRD', 'pequeno', 'Macho', 'Preto e Branco', 0, 0, 1, 'Brincalhão', 1, 1, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop', 'Filhotinho muito curioso que adora caçar bolinhas de papel e escalar arranhadores. Já tomou a primeira dose das vacinas.', 'disponivel', 'São Paulo', 'Tatuapé', 1),

-- 9. Cachorro, Grande, Jovem, Atleta
('Amora', 'cachorro', 'Golden Retriever', 'grande', 'Fêmea', 'Dourada', 2, 1, 1, 'Atleta', 1, 1, 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop', 'Extremamente dócil e carinhosa com todos que conhece. Adora buscar a bolinha e convive perfeitamente com outros animais.', 'disponivel', 'Guarulhos', 'Gopoúva', 2),

-- 10. Gato, Pequeno, Idoso, Calmo
('Simba', 'gato', 'SRD', 'pequeno', 'Macho', 'Tigrado Laranja', 8, 1, 1, 'Calmo', 1, 1, 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop', 'Um companheiro maduro, muito tranquilo e ronronador. Perfeito para quem busca um pet calmo e carinhoso para fazer companhia.', 'disponivel', 'Guarulhos', 'Vila Galvão', 2),

-- 11. Cachorro, Médio, Adulto, Brincalhão
('Bob', 'cachorro', 'Boxer', 'medio', 'Macho', 'Tigrado', 5, 1, 1, 'Brincalhão', 1, 0, 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600&auto=format&fit=crop', 'Muito brincalhão e engraçado. Protege a casa e ama crianças, mas costuma ser ciumento com outros cães da casa.', 'disponivel', 'Guarulhos', 'Paraventi', 2),

-- 12. Gato, Pequeno, Adulto, Calmo
('Nina', 'gato', 'SRD', 'pequeno', 'Fêmea', 'Escama de Tartaruga', 3, 1, 0, 'Calmo', 0, 0, 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=600&auto=format&fit=crop', 'Gata tímida no início, mas muito amorosa quando ganha confiança. Prefere ambientes sossegados e sem crianças pequenas.', 'disponivel', 'São Paulo', 'Santana', 2),

-- 13. Cachorro, Grande, Idoso, Calmo
('Cacau', 'cachorro', 'SRD', 'grande', 'Fêmea', 'Marrom', 10, 1, 1, 'Calmo', 1, 1, 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=600&auto=format&fit=crop', 'Uma vovózona gigante e gentil. Passa a maior parte do dia deitada, adora companhia humana e é extremamente pacífica.', 'disponivel', 'Guarulhos', 'Aeroporto', 2),

-- 14. Gato, Pequeno, Adulto, Brincalhão
('Frederico', 'gato', 'Angorá', 'pequeno', 'Macho', 'Branco Longo', 4, 1, 1, 'Brincalhão', 1, 1, 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?q=80&w=600&auto=format&fit=crop', 'Muito ativo e sociável. Adora seguir o dono pela casa conversando (mia bastante) e ama caçar brinquedos com laser.', 'disponivel', 'Guarulhos', 'Cecap', 2),

-- 15. Cachorro, Grande, Adulto, Atleta
('Marley', 'cachorro', 'Pitbull', 'grande', 'Macho', 'Branco e Marrom', 3, 1, 1, 'Atleta', 0, 0, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=600&auto=format&fit=crop', 'Forte, dócil com adultos e cheio de energia. Precisa de um tutor experiente com a raça e que tenha tempo para exercícios.', 'disponivel', 'Guarulhos', 'Pimentas', 2),

-- 16. Cachorro, Pequeno, Adulto, Brincalhão
('Frida', 'cachorro', 'Dachshund', 'pequeno', 'Fêmea', 'Preto e Canela', 1, 1, 1, 'Brincalhão', 1, 1, 'https://images.unsplash.com/photo-1612195583950-b8fd34c87093?q=80&w=600&auto=format&fit=crop', 'Uma "salsichinha" muito corajosa e alerta. Adora cavoucar cobertas, brincar com chinelos antigos e é super apegada à família.', 'disponivel', 'Guarulhos', 'Centro', 2);

INSERT INTO eventos (titulo, descricao, data_evento, local, cidade, bairro, imagem_url, status) VALUES
('Feira de Adoção - Centro', 'Venha conhecer nossos pets disponíveis para adoção.', '2026-04-10', 'Praça Central', 'Guarulhos', 'Centro', 'img/evento1.jpg', 'ativo'),
('Evento de Adoção - Parque Cecap', 'Evento com vários animais resgatados prontos para adoção.', '2026-04-20', 'Parque Cecap', 'Guarulhos', 'Cecap', 'img/evento2.jpg', 'ativo');

INSERT INTO inscricoes_evento (evento_id, usuario_id, nome, email, telefone, quantidade_pessoas, observacoes) VALUES
(1, 2, 'João', 'joao@email.com', '11988888888', 2, 'Levarei minha família'),
(2, 1, 'Ana', 'ana@email.com', '11999999999', 3, 'Interessada em adotar 2 gatos');

INSERT INTO denuncias (descricao, tipo, localizacao, contato, anonimo, status, usuario_id) VALUES
('Animal abandonado em situação de risco.', 'abandono', 'Rua das Flores, 123 - Guarulhos', '11944444444', 0, 'pendente', NULL),
('Cachorro preso sem comida.', 'maus-tratos', 'Av. Brasil, 456 - Guarulhos', '11988888888', 1, 'em_analise', 2);

INSERT INTO doacoes (usuario_id, nome_doador, email_doador, valor, mensagem, data_doacao) VALUES
(2, 'João Silva', 'joao@email.com', 50.00, 'Ajuda para ração', '2026-06-25'),
(1, 'Ana Souza', 'ana@email.com', 120.00, 'Para cuidados veterinários', '2026-05-25');

INSERT INTO agendamentos_visita (pet_id, usuario_id, nome_interessado, email_interessado, telefone_interessado, data_visita, horario_visita, status) VALUES
(1, 2, 'João Silva', 'joao@email.com', '11988888888', '2026-07-05', '14:00:00', 'agendado'),
(2, 1, 'Ana Souza', 'ana@email.com', '11999999999', '2026-04-06', '10:30:00', 'agendado');