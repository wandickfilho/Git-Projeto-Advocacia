DROP DATABASE IF EXISTS advocacia;
CREATE DATABASE advocacia;
USE advocacia;

CREATE TABLE cadastroAdvogado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_adv VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_adv VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE processos (
    id_processo INT AUTO_INCREMENT PRIMARY KEY,
    numero_processo VARCHAR(50) UNIQUE NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    cpf_cliente VARCHAR(14) NOT NULL,
    tipo_acao VARCHAR(50) NOT NULL,
    status_processo ENUM('Em andamento','Concluído','Arquivado','Pendente')
        DEFAULT 'Em andamento',
    data_protocolo DATE NOT NULL,
    descricao TEXT,
    adv_id INT NOT NULL,
    fotos JSON NULL,
    documentos JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adv_id) REFERENCES cadastroAdvogado(id)
);

SELECT * FROM cadastroAdvogado;
SELECT * FROM processos;
SELECT id, nome_adv, email FROM cadastroAdvogado;

