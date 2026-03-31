<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Support\JsonResponse;

class HealthController
{
    public function index(): void
    {
        JsonResponse::send([
            'success' => true,
            'message' => 'API funcionando perfeitamente'
        ], 200);
    }
}