<?php

declare(strict_types=1);

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class JwtService
{
    private string $secret;
    private string $issuer;
    private string $audience;
    private int $ttl;

    public function __construct()
    {
        $this->secret   = $_ENV['JWT_SECRET'] ?? 'secret';
        $this->issuer   = $_ENV['JWT_ISSUER'] ?? 'toca-api';
        $this->audience = $_ENV['JWT_AUDIENCE'] ?? 'toca-clients';
        $this->ttl      = (int) ($_ENV['JWT_TTL'] ?? 3600);
    }

    public function createAccessToken(array $user): string
    {
        $now = time();

        $payload = [
            'iss' => $this->issuer,
            'aud' => $this->audience,
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + $this->ttl,
            'sub' => (string) $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function decode(string $token): object
    {
        return JWT::decode($token, new Key($this->secret, 'HS256'));
    }
}