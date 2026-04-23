CREATE DATABASE advocacia;
USE advocacia;

CREATE TABLE cadastroAdvogado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_adv VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE processos (
    id_processo INT AUTO_INCREMENT PRIMARY KEY,
    numero_processo VARCHAR(50) UNIQUE NOT NULL,
    nome_cliente VARCHAR(50) NOT NULL,
    tipo_acao VARCHAR(50) NOT NULL,
    status_processo ENUM('Em andamento', 'Concluído', 'Arquivado', 'Pendente') DEFAULT 'Em andamento',
    data_protocolo DATE NOT NULL,
    cpf_cliente VARCHAR(11) NOT NULL,
    adv_id INT NOT NULL,
    FOREIGN KEY (adv_id) REFERENCES cadastroAdvogado(id)
    
);

USE advocacia;