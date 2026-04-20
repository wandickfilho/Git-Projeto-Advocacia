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
('8492384298492849284820842', 'Trabalhista', 'Em andamento', '2026-04-29', 1),
('123456789101112131415', 'Trabalhista', 'Concluído', '2026-04-14', 2),
('10987654321099876566', 'Civil', 'Concluído', '2026-04-14', 3),
('8775324928471824714891', 'Criminal', 'Em andamento', '2026-04-14', 1),
('758731943204920957839752', 'Civil', 'Arquivado', '2026-04-14', 2);