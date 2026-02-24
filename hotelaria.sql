-- Script SQL para criar as tabelas do sistema de hotelaria

CREATE TABLE hospede (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    cpf VARCHAR(14) UNIQUE
);

CREATE TABLE quarto (
    id_quarto SERIAL PRIMARY KEY,
    numero INT NOT NULL UNIQUE,
    tipo VARCHAR(50),
    capacidade INT,
    valor_diaria NUMERIC(10,2),
    status VARCHAR(20)
);

CREATE TABLE servico (
    id_servico SERIAL PRIMARY KEY,
    valor_unitario NUMERIC(10,2),
    categoria VARCHAR(50)
);

CREATE TABLE reserva (
    id_reserva SERIAL PRIMARY KEY,
    cpf_hospede VARCHAR(14) REFERENCES hospede(cpf),
    id_quarto INT REFERENCES quarto(id_quarto),
    data_checkin DATE,
    data_checkout DATE,
    status VARCHAR(20),
    valor_total NUMERIC(10,2)
);

CREATE TABLE pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_reserva INT REFERENCES reserva(id_reserva),
    data_pagamento DATE,
    valor NUMERIC(10,2),
    forma_pagamento VARCHAR(50),
    status VARCHAR(20)
);

-- ==============================
-- DADOS DE EXEMPLO (INSERTS)
-- Ordem: hospede -> funcionario -> quarto -> servico -> reserva -> pagamento
-- ==============================

-- Populando hospede
INSERT INTO hospede (cpf, nome, telefone, email) VALUES
('123.456.789-00', 'Ana Silva', '11999999999', 'ana.silva@email.com'),
('987.654.321-00', 'Carlos Souza', '21988888888', 'carlos.souza@email.com'),
('111.222.333-44', 'Maria Oliveira', '31977777777', 'maria.oliveira@email.com'),
('555.666.777-88', 'João Pereira', '41966666666', 'joao.pereira@email.com'),
('999.888.777-66', 'Fernanda Lima', '51955555555', 'fernanda.lima@email.com'),
('222.333.444-55', 'Marcos Santana', '11944443333', 'marcos.santana@email.com'),
('333.444.555-66', 'Beatriz Rocha', '21933332222', 'beatriz.rocha@email.com'),
('444.555.666-77', 'Ricardo Alves', '31922221111', 'ricardo.alves@email.com'),
('666.777.888-99', 'Sofia Mendes', '41911110000', 'sofia.mendes@email.com'),
('777.888.999-00', 'Igor Campos', '51900009999', 'igor.campos@email.com');

-- Populando funcionario
INSERT INTO funcionario (nome, cargo, cpf) VALUES
('Pedro Santos', 'Recepcionista', '222.333.444-55'),
('Juliana Costa', 'Gerente', '333.444.555-66'),
('Roberto Almeida', 'Camareiro', '444.555.666-77'),
('Patricia Ramos', 'Cozinheira', '555.666.777-88'),
('Lucas Martins', 'Manutenção', '666.777.888-99');

-- Populando quarto (números variados)
INSERT INTO quarto (numero, tipo, capacidade, valor_diaria, status) VALUES
(101, 'Solteiro', 1, 120.00, 'Livre'),
(102, 'Casal', 2, 180.00, 'Livre'),
(103, 'Duplo', 2, 160.00, 'Ocupado'),
(104, 'Família', 4, 250.00, 'Livre'),
(105, 'Solteiro', 1, 120.00, 'Ocupado'),
(106, 'Casal', 2, 180.00, 'Livre'),
(107, 'Duplo', 2, 160.00, 'Livre'),
(108, 'Família', 4, 250.00, 'Livre'),
(109, 'Suíte', 2, 320.00, 'Livre'),
(110, 'Suíte Master', 3, 420.00, 'Livre');

-- Populando servico
INSERT INTO servico (valor_unitario, categoria) VALUES
(30.00, 'Lavanderia'),
(50.00, 'Café da manhã'),
(80.00, 'Jantar'),
(20.00, 'Internet'),
(100.00, 'Spa'),
(40.00, 'Transporte'),
(15.00, 'Estacionamento');

-- Populando reserva (inserindo id_reserva explicitamente para controle)
-- OBS: os quartos foram inseridos sem especificar `id_quarto` (serial),
-- portanto seus ids serão 1..10 na mesma ordem.
INSERT INTO reserva (id_reserva, cpf_hospede, id_quarto, data_checkin, data_checkout, status, valor_total) VALUES
(1, '123.456.789-00', 3, '2026-02-20', '2026-02-23', 'Confirmada', 480.00),
(2, '987.654.321-00', 5, '2026-02-21', '2026-02-24', 'Confirmada', 360.00),
(3, '111.222.333-44', 2, '2026-02-22', '2026-02-25', 'Cancelada', 540.00),
(4, '555.666.777-88', 1, '2026-02-23', '2026-02-26', 'Confirmada', 360.00),
(5, '999.888.777-66', 4, '2026-02-24', '2026-02-27', 'Confirmada', 750.00),
(6, '222.333.444-55', 6, '2026-03-01', '2026-03-04', 'Confirmada', 540.00),
(7, '333.444.555-66', 7, '2026-03-02', '2026-03-05', 'Confirmada', 480.00),
(8, '444.555.666-77', 8, '2026-03-03', '2026-03-06', 'Confirmada', 750.00),
(9, '666.777.888-99', 9, '2026-03-04', '2026-03-06', 'Confirmada', 640.00),
(10,'777.888.999-00',10, '2026-03-05', '2026-03-09', 'Confirmada', 1680.00);

-- Populando pagamento (referenciando reservas já inseridas)
INSERT INTO pagamento (id_pagamento, id_reserva, data_pagamento, valor, forma_pagamento, status) VALUES
(1, 1, '2026-02-20', 480.00, 'Cartão de Crédito', 'Pago'),
(2, 2, '2026-02-21', 360.00, 'Dinheiro', 'Pago'),
(3, 3, '2026-02-22', 540.00, 'Cartão de Débito', 'Cancelado'),
(4, 4, '2026-02-23', 360.00, 'Pix', 'Pago'),
(5, 5, '2026-02-24', 750.00, 'Cartão de Crédito', 'Pago'),
(6, 6, '2026-03-01', 540.00, 'Pix', 'Pago'),
(7, 7, '2026-03-02', 480.00, 'Cartão de Crédito', 'Pago'),
(8, 8, '2026-03-03', 750.00, 'Dinheiro', 'Pago'),
(9, 9, '2026-03-04', 640.00, 'Cartão de Débito', 'Pago'),
(10,10, '2026-03-05', 1680.00,'Cartão de Crédito', 'Pendente');

-- Ajustar sequências para os próximos valores automáticos (PostgreSQL)
SELECT setval(pg_get_serial_sequence('funcionario','id_funcionario'), COALESCE((SELECT MAX(id_funcionario) FROM funcionario),0)+1, false);
SELECT setval(pg_get_serial_sequence('quarto','id_quarto'), COALESCE((SELECT MAX(id_quarto) FROM quarto),0)+1, false);
SELECT setval(pg_get_serial_sequence('servico','id_servico'), COALESCE((SELECT MAX(id_servico) FROM servico),0)+1, false);
SELECT setval(pg_get_serial_sequence('reserva','id_reserva'), COALESCE((SELECT MAX(id_reserva) FROM reserva),0)+1, false);
SELECT setval(pg_get_serial_sequence('pagamento','id_pagamento'), COALESCE((SELECT MAX(id_pagamento) FROM pagamento),0)+1, false);

