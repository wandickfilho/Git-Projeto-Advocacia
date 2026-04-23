<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "advocacia";

// nome do arquivo com data
$data = date("Y-m-d_H-i-s");
$arquivo = "backup/backup_$data.sql";

// comando mysqldump
$comando = "mysqldump -h $host -u $user $db > $arquivo";

// executa o comando
system($comando, $resultado);

if ($resultado === 0) {
    echo "Backup criado com sucesso: $arquivo";
} else {
    echo "Erro ao criar backup";
}

?>