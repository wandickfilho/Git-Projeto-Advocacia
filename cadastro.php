<?php
include("conexao.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nome = $_POST["Nome Completo"];
    $email = $_POST["Email"];
    $senha = $_POST["Senha"];

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    $sql = "INSERT INTO cadastroAdvogado (nome_adv, email, senha_adv)
            VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $nome, $email, $senhaHash);

    if ($stmt->execute()){
        echo "Cadastrado com sucesso!";
    } else {
        echo "Erro: " . $stmt->error;
    }

    $conn->close();
}
?>