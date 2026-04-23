DROP DATABASE IF EXISTS advocacia;
CREATE DATABASE advocacia;
USE advocacia;

CREATE TABLE IF NOT EXISTS cadastroAdvogado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_adv VARCHAR(100) NOT NULL,
    senha_adv VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS processos;

CREATE TABLE IF NOT EXISTS processos (
    id_processo INT AUTO_INCREMENT PRIMARY KEY,
    numero_processo VARCHAR(50) UNIQUE NOT NULL,
    nome_cliente VARCHAR(50) NOT NULL,
    tipo_acao VARCHAR(50) NOT NULL,
    status_processo ENUM('Em andamento', 'Concluído', 'Arquivado', 'Pendente') 
        DEFAULT 'Em andamento',
    data_protocolo DATE NOT NULL,
    cpf_cliente VARCHAR(11) NOT NULL,
    adv_id INT NOT NULL,
    FOREIGN KEY (adv_id) REFERENCES cadastroAdvogado(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO cadastroAdvogado (nome_adv, email)
VALUES ('João Silva', 'joao@email.com');
SELECT * FROM cadastroAdvogado;
INSERT INTO processos (
    numero_processo,
    nome_cliente,
    tipo_acao,
    data_protocolo,
    cpf_cliente,
    adv_id
)
VALUES (
    '123456-89.2026.1.01.0001',
    'Maria Souza',
    'Civil',
    '2026-04-22',
    '12345678901',
    1
);
SELECT * FROM cadastroAdvogado;
SELECT * FROM processos;