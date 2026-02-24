-- ============================================
-- CRIAÇÃO DAS TABELAS - SISTEMA HOTELARIA
-- ============================================

CREATE TABLE IF NOT EXISTS hospede (
	cpf VARCHAR(14) PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	telefone VARCHAR(20),
	email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS funcionario (
	id_funcionario SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	cargo VARCHAR(50),
	cpf VARCHAR(14) UNIQUE
);

CREATE TABLE IF NOT EXISTS quarto (
	id_quarto SERIAL PRIMARY KEY,
	numero INT NOT NULL UNIQUE,
	tipo VARCHAR(50),
	capacidade INT,
	valor_diaria NUMERIC(10,2),
	status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS reserva (
	id_reserva SERIAL PRIMARY KEY,
	cpf_hospede VARCHAR(14) NOT NULL REFERENCES hospede(cpf),
	id_quarto INT NOT NULL REFERENCES quarto(id_quarto),
	id_funcionario INT REFERENCES funcionario(id_funcionario),
	data_checkin DATE,
	data_checkout DATE,
	status VARCHAR(20),
	valor_total NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS servico (
	id_servico SERIAL PRIMARY KEY,
	id_reserva INT REFERENCES reserva(id_reserva) ON DELETE CASCADE,
	id_funcionario INT REFERENCES funcionario(id_funcionario),
	valor_unitario NUMERIC(10,2),
	categoria VARCHAR(50),
	quantidade INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pagamento (
	id_pagamento SERIAL PRIMARY KEY,
	id_reserva INT REFERENCES reserva(id_reserva),
	data_pagamento DATE,
	valor NUMERIC(10,2),
	forma_pagamento VARCHAR(50),
	status VARCHAR(20)
);

-- ============================================
-- POPULAÇÃO INICIAL (DADOS DE EXEMPLO)
-- ============================================

-- Hóspedes
INSERT INTO hospede (cpf, nome, telefone, email) VALUES
('123.456.789-00', 'Ana Silva', '11999999999', 'ana.silva@email.com'),
('987.654.321-00', 'Carlos Souza', '21988888888', 'carlos.souza@email.com'),
('111.222.333-44', 'Maria Oliveira', '31977777777', 'maria.oliveira@email.com'),
('555.666.777-88', 'João Pereira', '41966666666', 'joao.pereira@email.com'),
('999.888.777-66', 'Fernanda Lima', '51955555555', 'fernanda.lima@email.com')
ON CONFLICT (cpf) DO NOTHING;

-- Funcionários
INSERT INTO funcionario (nome, cargo, cpf) VALUES
('Pedro Santos', 'Recepcionista', '222.333.444-55'),
('Juliana Costa', 'Gerente', '333.444.555-66'),
('Roberto Almeida', 'Camareiro', '444.555.666-77')
ON CONFLICT (cpf) DO NOTHING;

-- Quartos
INSERT INTO quarto (numero, tipo, capacidade, valor_diaria, status) VALUES
(101, 'Solteiro', 1, 120.00, 'Livre'),
(102, 'Casal', 2, 180.00, 'Livre'),
(103, 'Duplo', 2, 160.00, 'Livre'),
(104, 'Família', 4, 250.00, 'Livre'),
(105, 'Suíte', 2, 320.00, 'Livre')
ON CONFLICT (numero) DO NOTHING;

-- Reservas
INSERT INTO reserva (cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total)
SELECT '123.456.789-00', q.id_quarto, f.id_funcionario, DATE '2026-03-01', DATE '2026-03-04', 'Confirmada', 360.00
FROM quarto q, funcionario f
WHERE q.numero = 101 AND f.cpf = '222.333.444-55'
	AND NOT EXISTS (
		SELECT 1 FROM reserva r
		WHERE r.cpf_hospede = '123.456.789-00' AND r.id_quarto = q.id_quarto
			AND r.data_checkin = DATE '2026-03-01' AND r.data_checkout = DATE '2026-03-04'
	);

INSERT INTO reserva (cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total)
SELECT '987.654.321-00', q.id_quarto, f.id_funcionario, DATE '2026-03-05', DATE '2026-03-08', 'Confirmada', 540.00
FROM quarto q, funcionario f
WHERE q.numero = 102 AND f.cpf = '333.444.555-66'
	AND NOT EXISTS (
		SELECT 1 FROM reserva r
		WHERE r.cpf_hospede = '987.654.321-00' AND r.id_quarto = q.id_quarto
			AND r.data_checkin = DATE '2026-03-05' AND r.data_checkout = DATE '2026-03-08'
	);

-- Serviços
INSERT INTO servico (id_reserva, id_funcionario, valor_unitario, categoria, quantidade)
SELECT r.id_reserva, f.id_funcionario, 50.00, 'Café da manhã', 3
FROM reserva r, funcionario f
WHERE r.cpf_hospede = '123.456.789-00' AND f.cpf = '444.555.666-77'
	AND NOT EXISTS (
		SELECT 1 FROM servico s
		WHERE s.id_reserva = r.id_reserva AND s.categoria = 'Café da manhã'
	);

INSERT INTO servico (id_reserva, id_funcionario, valor_unitario, categoria, quantidade)
SELECT r.id_reserva, f.id_funcionario, 80.00, 'Jantar', 1
FROM reserva r, funcionario f
WHERE r.cpf_hospede = '987.654.321-00' AND f.cpf = '222.333.444-55'
	AND NOT EXISTS (
		SELECT 1 FROM servico s
		WHERE s.id_reserva = r.id_reserva AND s.categoria = 'Jantar'
	);

-- Pagamentos
INSERT INTO pagamento (id_reserva, data_pagamento, valor, forma_pagamento, status)
SELECT r.id_reserva, DATE '2026-03-01', 360.00, 'Pix', 'Pago'
FROM reserva r
WHERE r.cpf_hospede = '123.456.789-00'
	AND NOT EXISTS (
		SELECT 1 FROM pagamento p
		WHERE p.id_reserva = r.id_reserva AND p.data_pagamento = DATE '2026-03-01'
	);

INSERT INTO pagamento (id_reserva, data_pagamento, valor, forma_pagamento, status)
SELECT r.id_reserva, DATE '2026-03-05', 540.00, 'Cartão de Crédito', 'Pendente'
FROM reserva r
WHERE r.cpf_hospede = '987.654.321-00'
	AND NOT EXISTS (
		SELECT 1 FROM pagamento p
		WHERE p.id_reserva = r.id_reserva AND p.data_pagamento = DATE '2026-03-05'
	);
