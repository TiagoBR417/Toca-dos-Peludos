# Toca dos Peludos – Sistema de Gestão e Adoção
//login
http://localhost/Toca-dos-Peludos/frontend/login.html

tabelas para teste
-- Apaga a tabela antiga se ela existir para evitarmos conflitos
DROP TABLE IF EXISTS pets;

-- Cria a tabela com os campos exatos que o seu JS pede
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

-- Insere 4 animais de teste com links de imagens da internet
INSERT INTO pets (nome, tipo, raca, porte, status, imagemUrl) VALUES
('Rex', 'Cachorro', 'SRD (Vira-lata)', 'Médio', 'DISPONÍVEL', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'),
('Mimi', 'Gato', 'Siamês', 'Pequeno', 'DISPONÍVEL', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'),
('Thor', 'Cachorro', 'Golden Retriever', 'Grande', 'EM PROCESSO', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'),
('Luna', 'Gato', 'Persa', 'Pequeno', 'DISPONÍVEL', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80');





Projeto seguindo o PRD em `PRD.txt`, com arquitetura Client-Server:
- Backend: Spring Boot (Java 21), JWT, JPA, PostgreSQL
- Frontend: HTML/CSS/JS responsivo consumindo a API

## Executando o Backend

Pré‑requisitos:
- Java 21+
- Maven
- PostgreSQL disponível

Variáveis de ambiente:
- `DB_URL` (ex: `jdbc:postgresql://localhost:5432/tocadospeludos`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `ADMIN_USERNAME` (default: `admin`)
- `ADMIN_PASSWORD` (default: `admin`)
- `JWT_SECRET` (obrigatório em produção)
- `JWT_EXPIRATION_SECONDS` (default: `3600`)
- `CORS_ALLOWED_ORIGINS` (ex: `http://localhost:8081`)

Build e execução:

```bash
mvn -f backend/pom.xml clean package
java -jar backend/target/toca-dos-peludos-0.1.0.jar
```

Swagger/OpenAPI:
- Acesse `http://localhost:8080/swagger-ui.html`

Autenticação (Admin):
1. `POST /api/v1/auth/login` com `{ "username": "...", "password": "..." }`
2. Receba `token` JWT e use `Authorization: Bearer <token>` nos endpoints `/api/v1/admin/**`

## Executando o Frontend

Abra `frontend/index.html` em um servidor estático (ex.: VS Code Live Server) ouvindo em `http://localhost:8081` para compatibilidade com CORS padrão.

## Endpoints Principais

Público:
- `GET /api/v1/pets` (filtros: `especie`, `porte`, `sexo`)
- `GET /api/v1/pets/{id}`
- `POST /api/v1/adocoes?pet_id={id}`

Admin (JWT):
- `POST /api/v1/admin/pets`
- `PUT /api/v1/admin/pets/{id}`
- `GET /api/v1/admin/solicitacoes`

## Segurança e LGPD
- RBAC: público (visualiza e envia interesse), admin (CRUD de pets e visualização de solicitações)
- Senhas com BCrypt
- JWT para sessão do admin
- CORS restrito ao(s) domínio(s) do frontend
- Consentimento explícito no formulário de interesse

## Próximos Passos
- Dashboard Admin (RF04)
- Fluxo de voluntários e denúncias anônimas
- Persistência e autenticação de admins no banco

## Rodando com Docker (sem instalar Maven/PostgreSQL)

Pré‑requisitos:
- Docker Desktop instalado e rodando

Comandos:

```bash
docker compose up -d --build
```

Serviços:
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432 (db serviço interno)

Variáveis já configuradas no compose:
- `DB_URL=jdbc:postgresql://db:5432/tocadospeludos`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `ADMIN_USERNAME=admin` / `ADMIN_PASSWORD=admin`
- `JWT_SECRET=change-this-secret` (troque para produção)
- `CORS_ALLOWED_ORIGINS=http://localhost:8081,http://127.0.0.1:8081`
