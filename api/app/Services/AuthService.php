<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;
use InvalidArgumentException;

final class AuthService
{
    public function __construct(
        private UserRepository $users = new UserRepository(),
        private JwtService $jwt = new JwtService(),
    ) {}

    public function register(string $name, string $email, string $password): array
    {
        $email = strtolower(trim($email));
        $name = trim($name);

        if ($name === '') {
            throw new InvalidArgumentException('Nome é obrigatório.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('E-mail inválido.');
        }

        if (strlen($password) < 6) {
            throw new InvalidArgumentException('A senha deve ter pelo menos 6 caracteres.');
        }

        if ($this->users->findByEmail($email)) {
            throw new InvalidArgumentException('E-mail já cadastrado.');
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $id = $this->users->create($name, $email, $hash);
        $user = $this->users->findById($id);

        return [
            'success' => true,
            'message' => 'Usuário cadastrado com sucesso.',
            'data' => [
                'user' => $user,
                'access_token' => $this->jwt->createAccessToken([
                    'id' => $id,
                    'email' => $email,
                    'role' => 'client',
                ]),
            ]
        ];
    }

    public function login(string $email, string $password): array
    {
        $email = strtolower(trim($email));
        $user = $this->users->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new InvalidArgumentException('Credenciais inválidas.');
        }

        return [
            'success' => true,
            'message' => 'Login realizado com sucesso.',
            'data' => [
                'user' => [
                    'id' => (int) $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                ],
                'access_token' => $this->jwt->createAccessToken($user),
            ]
        ];
    }
}