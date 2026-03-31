<?php

namespace App\Config;

use mysqli;
use mysqli_sql_exception;

class Database
{
    private static ?mysqli $connection = null;

    public static function getConnection(): mysqli
    {
        if (self::$connection === null) {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

            self::$connection = new mysqli(
                $_ENV['DB_HOST'] ?? '127.0.0.1',
                $_ENV['DB_USERNAME'] ?? 'root',
                $_ENV['DB_PASSWORD'] ?? '',
                $_ENV['DB_DATABASE'] ?? 'toca_dos_peludos',
                (int) ($_ENV['DB_PORT'] ?? 3306)
            );

            self::$connection->set_charset('utf8mb4');
        }

        return self::$connection;
    }
}