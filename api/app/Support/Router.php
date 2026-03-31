<?php

declare(strict_types=1);

namespace App\Support;

final class Router
{
    private array $routes = [];

    public function get(string $path, array $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, array $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $baseDir = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');

        if ($baseDir !== '' && str_starts_with($path, $baseDir)) {
            $path = substr($path, strlen($baseDir));
        }

        if (str_starts_with($path, '/index.php')) {
            $path = substr($path, strlen('/index.php'));
        }

        if ($path === '' || $path === false) {
            $path = '/';
        }

        $handler = $this->routes[$method][$path] ?? null;

        if (!$handler) {
            JsonResponse::send([
                'success' => false,
                'message' => 'Rota não encontrada',
                'path' => $path,
                'method' => $method
            ], 404);
        }

        [$class, $action] = $handler;
        (new $class())->$action();
    }
}