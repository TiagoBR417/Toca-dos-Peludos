<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap/app.php';

$router = require __DIR__ . '/../config/routes.php';
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);