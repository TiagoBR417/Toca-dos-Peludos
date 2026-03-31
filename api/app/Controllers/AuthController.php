<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;
use App\Support\JsonResponse;
use App\Support\Request;
use InvalidArgumentException;
use OpenApi\Attributes as OA;

final class AuthController
{
    #[OA\Post(
        path: '/api/v1/auth/register',
        tags: ['Auth'],
        summary: 'Cadastrar usuário',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Tiago Oliveira'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'tiago@email.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: '12345678'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Usuário cadastrado'),
            new OA\Response(response: 400, description: 'Erro de validação')
        ]
    )]
    public function register(): void
    {
        $data = Request::json();

        try {
            $result = (new AuthService())->register(
                $data['name'] ?? '',
                $data['email'] ?? '',
                $data['password'] ?? '',
            );

            JsonResponse::send($result, 201);
        } catch (InvalidArgumentException $e) {
            JsonResponse::send([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    #[OA\Post(
        path: '/api/v1/auth/login',
        tags: ['Auth'],
        summary: 'Autenticar usuário',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                    new OA\Property(property: 'password', type: 'string', format: 'password'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Login ok'),
            new OA\Response(response: 401, description: 'Credenciais inválidas')
        ]
    )]
    public function login(): void
    {
        $data = Request::json();

        try {
            $result = (new AuthService())->login(
                $data['email'] ?? '',
                $data['password'] ?? '',
            );

            JsonResponse::send($result, 200);
        } catch (InvalidArgumentException $e) {
            JsonResponse::send([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }
    }
}