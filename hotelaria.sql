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
