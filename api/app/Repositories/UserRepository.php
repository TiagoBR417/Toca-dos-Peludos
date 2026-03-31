<?php

namespace App\Repositories;

use App\Config\Database;
use mysqli;

class EventoRepository
{
    private mysqli $conn;

    public function __construct()
    {
        $this->conn = Database::getConnection();
    }

    public function all(): array
    {
        $sql = "SELECT * FROM eventos";
        $result = $this->conn->query($sql);

        $eventos = [];

        while ($row = $result->fetch_assoc()) {
            $eventos[] = $row;
        }

        return $eventos;
    }
}