<?php 

$host = "localhost";
$user = "root";
$pass = "";
$db = "advocacia";

$conn = new mysqli($host,$user,$pass,$db);

if ($conn->connect_error) {
    die("ERRO DE CONEXÃO: ". $conn->connect_error);

}
?>