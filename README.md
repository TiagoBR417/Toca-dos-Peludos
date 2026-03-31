# Toca dos Peludos

Projeto acadêmico voltado para adoção, divulgação e gestão de informações relacionadas a pets.

## Estrutura do projeto

O projeto está dividido em duas partes principais:

- `frontend/` → interface em HTML, CSS e JavaScript
- `api/` → backend em PHP responsável por autenticação, regras de negócio e comunicação com banco de dados

## Tecnologias utilizadas

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- PHP 8.2+
- MySQL
- PDO
- JWT
- Dotenv
- Swagger/OpenAPI

## Organização do backend

A pasta `api/` está organizada da seguinte forma:

- `public/` → ponto de entrada da API
- `bootstrap/` → inicialização do sistema
- `config/` → registro das rotas
- `app/Controllers/` → controllers da aplicação
- `app/Services/` → regras de negócio
- `app/Repositories/` → acesso ao banco de dados
- `app/Support/` → classes auxiliares
- `database/` → estrutura inicial do banco

## Funcionalidades atuais do backend

Atualmente, o backend possui:

- conexão com banco de dados MySQL
- cadastro de usuários
- login de usuários
- geração de token JWT
- resposta em JSON
- rota de verificação de funcionamento da API

## Como executar o backend

### Pré-requisitos
- PHP 8.2 ou superior
- Composer
- MySQL
- XAMPP ou outro ambiente local com Apache/PHP

### Instalação
Dentro da pasta `api/`, execute:

```bash
cd api
composer install