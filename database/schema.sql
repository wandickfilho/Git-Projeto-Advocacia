CREATE DATABASE advocacia;
USE advocacia;
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE processos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_processo VARCHAR(50) UNIQUE NOT NULL,
    tipo_acao VARCHAR(50),
    status ENUM('Em andamento', 'Concluído', 'Arquivado') DEFAULT 'Em andamento',
    data_protocolo DATE,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
USE advocacia;

INSERT INTO clientes (nome, cpf) VALUES
INSERT INTO processos (numero_processo, tipo_acao, status, data_protocolo, cliente_id) VALUES
