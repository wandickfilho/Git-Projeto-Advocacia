<?php 

session_start();

$host = "localhost";
$user = "root";
$pass = "";
$db = "advocacia";

$conn = new mysqli($host,$user,$pass,$db);

if ($conn->connect_error) {
    die("Erro de conexão". $conn->connect_error);
}

$email = $_POST["Email"];
$senha = $_POST["Senha"];

$sql = "SELECT * FROM cadastroAdvogado WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt_get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    if (password_verify($senha, $usuario["senha_adv"])) {

    $_SESSION["id"] = $usuario["id"];
    $_SESSION["nome"] = $usuario["nome_adv"];

    header("Location: dashboard.php");
    exit;

    } else {
        echo "Senha Incorreta! ";
    }
} else {
    echo "Usuario nao encontrado! ";
}
$conn->close();

?>