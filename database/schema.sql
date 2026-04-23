DROP DATABASE IF EXISTS advocacia;
CREATE DATABASE advocacia;
USE advocacia;

-- =========================
-- TABELA DE USUÁRIOS (ADVOGADOS)
-- =========================
CREATE TABLE IF NOT EXISTS cadastroAdvogado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_adv VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_adv VARCHAR(255) NOT NULL, -- 🔥 corrigido (bcrypt precisa disso)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- TABELA DE PROCESSOS
-- =========================
CREATE TABLE IF NOT EXISTS processos (
    id_processo INT AUTO_INCREMENT PRIMARY KEY,
    numero_processo VARCHAR(50) UNIQUE NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    tipo_acao VARCHAR(50) NOT NULL,
    status_processo ENUM('Em andamento', 'Concluído', 'Arquivado', 'Pendente') 
        DEFAULT 'Em andamento',
    data_protocolo DATE NOT NULL,
    cpf_cliente VARCHAR(11) NOT NULL,
    adv_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (adv_id) REFERENCES cadastroAdvogado(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
