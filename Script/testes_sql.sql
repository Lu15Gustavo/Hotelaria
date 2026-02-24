-- ============================================
-- TESTES SQL - SISTEMA DE HOTELARIA
-- Arquivo para testes no PGAdmin 4
-- ============================================

-- ============================================
-- 1. TESTES DE HÓPEDE
-- ============================================

-- 1.1 Listar todos os hóspedes
SELECT cpf, nome, telefone, email FROM hospede ORDER BY nome;

-- 1.2 Inserir novo hóspede
INSERT INTO hospede (cpf, nome, telefone, email) 
VALUES ('789.012.345-67', 'José Costa', '85987654321', 'jose.costa@email.com');

-- 1.3 Atualizar hóspede
UPDATE hospede SET telefone='85999999999', email='jose.novo@email.com' 
WHERE cpf='789.012.345-67';

-- 1.4 Buscar hóspede específico
SELECT * FROM hospede WHERE cpf='123.456.789-00';

-- 1.5 Buscar hóspedes por nome (LIKE)
SELECT * FROM hospede WHERE LOWER(nome) LIKE LOWER('%Silva%');

-- 1.6 Deletar hóspede (comentado para evitar exclusão acidental)
-- DELETE FROM hospede WHERE cpf='789.012.345-67';

-- ============================================
-- 2. TESTES DE FUNCIONÁRIO
-- ============================================

-- 2.1 Listar todos os funcionários
SELECT id_funcionario, nome, cargo, cpf FROM funcionario ORDER BY nome;

-- 2.2 Inserir novo funcionário
INSERT INTO funcionario (nome, cargo, cpf) 
VALUES ('Tiago Silva', 'Porteiro', '888.999.000-11');

-- 2.3 Atualizar cargo do funcionário
UPDATE funcionario SET cargo='Gerente' 
WHERE id_funcionario=6;

-- 2.4 Contar funcionários por cargo
SELECT cargo, COUNT(*) as total 
FROM funcionario 
GROUP BY cargo;

-- 2.5 Funcionário com maior número de serviços realizados
SELECT f.id_funcionario, f.nome, COUNT(s.id_servico) as total_servicos
FROM funcionario f
LEFT JOIN servico s ON f.id_funcionario = s.id_funcionario
GROUP BY f.id_funcionario, f.nome
ORDER BY total_servicos DESC;

-- ============================================
-- 3. TESTES DE QUARTO
-- ============================================

-- 3.1 Listar todos os quartos
SELECT id_quarto, numero, tipo, capacidade, valor_diaria, status 
FROM quarto ORDER BY numero;

-- 3.2 Listar apenas quartos livres
SELECT id_quarto, numero, tipo, capacidade, valor_diaria 
FROM quarto 
WHERE status='Livre' 
ORDER BY numero;

-- 3.3 Listar apenas quartos ocupados
SELECT id_quarto, numero, tipo, capacidade, valor_diaria 
FROM quarto 
WHERE status='Ocupado' 
ORDER BY numero;

-- 3.4 Inserir novo quarto
INSERT INTO quarto (numero, tipo, capacidade, valor_diaria, status) 
VALUES (111, 'Presidencial', 4, 500.00, 'Livre');

-- 3.5 Atualizar status do quarto
UPDATE quarto SET status='Ocupado' 
WHERE numero=101;

-- 3.6 Quarto mais caro vs mais barato
SELECT tipo, MAX(valor_diaria) as maior_valor, MIN(valor_diaria) as menor_valor
FROM quarto
GROUP BY tipo;

-- 3.7 Receita potencial por tipo de quarto (diária)
SELECT tipo, COUNT(*) as qtd_quartos, valor_diaria, (COUNT(*) * valor_diaria) as receita_diaria
FROM quarto
GROUP BY tipo, valor_diaria
ORDER BY receita_diaria DESC;

-- ============================================
-- 4. TESTES DE RESERVA
-- ============================================

-- 4.1 Listar todas as reservas
SELECT id_reserva, cpf_hospede, id_quarto, data_checkin, data_checkout, status, valor_total 
FROM reserva 
ORDER BY data_checkin DESC;

-- 4.2 Listar reservas confirmadas
SELECT id_reserva, cpf_hospede, id_quarto, data_checkin, data_checkout, valor_total 
FROM reserva 
WHERE status='Confirmada' 
ORDER BY data_checkin;

-- 4.3 Reservas ativas (datas atuais)
SELECT r.id_reserva, h.nome as hospede, q.numero as quarto, 
       r.data_checkin, r.data_checkout, r.status
FROM reserva r
JOIN hospede h ON r.cpf_hospede = h.cpf
JOIN quarto q ON r.id_quarto = q.id_quarto
WHERE r.data_checkin <= CURRENT_DATE AND r.data_checkout >= CURRENT_DATE;

-- 4.4 Inserir nova reserva
INSERT INTO reserva (cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total)
VALUES ('123.456.789-00', 2, 1, '2026-03-10', '2026-03-13', 'Confirmada', 540.00);

-- 4.5 Atualizar reserva para cancelada
UPDATE reserva SET status='Cancelada' 
WHERE id_reserva=1;

-- 4.6 Receita total por mês
SELECT DATE_TRUNC('month', data_checkin)::date as mes, 
       SUM(valor_total) as receita_total,
       COUNT(*) as quantidade_reservas
FROM reserva
WHERE status != 'Cancelada'
GROUP BY DATE_TRUNC('month', data_checkin)
ORDER BY mes DESC;

-- 4.7 Hóspede com mais reservas
SELECT h.cpf, h.nome, COUNT(r.id_reserva) as total_reservas
FROM hospede h
LEFT JOIN reserva r ON h.cpf = r.cpf_hospede
GROUP BY h.cpf, h.nome
ORDER BY total_reservas DESC;

-- 4.8 Duração média das reservas
SELECT AVG(EXTRACT(DAY FROM (data_checkout - data_checkin))) as dias_media
FROM reserva
WHERE status='Confirmada';

-- ============================================
-- 5. TESTES DE SERVIÇO
-- ============================================

-- 5.1 Listar todos os serviços
SELECT id_servico, id_reserva, id_funcionario, valor_unitario, categoria, quantidade 
FROM servico 
ORDER BY id_reserva DESC;

-- 5.2 Serviços por categoria
SELECT categoria, COUNT(*) as quantidade_servicos, SUM(valor_unitario * quantidade) as valor_total
FROM servico
GROUP BY categoria
ORDER BY valor_total DESC;

-- 5.3 Inserir novo serviço
INSERT INTO servico (id_reserva, id_funcionario, valor_unitario, categoria, quantidade)
VALUES (1, 2, 120.00, 'Massagem', 2);

-- 5.4 Atualizar quantidade de serviço
UPDATE servico SET quantidade=3 
WHERE id_servico=1;

-- 5.5 Valor total de serviços por reserva
SELECT s.id_reserva, SUM(s.valor_unitario * s.quantidade) as total_servicos
FROM servico s
GROUP BY s.id_reserva
ORDER BY total_servicos DESC;

-- 5.6 Serviço mais popular
SELECT categoria, COUNT(*) as vezes_solicitado
FROM servico
GROUP BY categoria
ORDER BY vezes_solicitado DESC
LIMIT 5;

-- ============================================
-- 6. TESTES DE PAGAMENTO
-- ============================================

-- 6.1 Listar todos os pagamentos
SELECT id_pagamento, id_reserva, data_pagamento, valor, forma_pagamento, status 
FROM pagamento 
ORDER BY data_pagamento DESC;

-- 6.2 Pagamentos realizados por forma
SELECT forma_pagamento, COUNT(*) as quantidade, SUM(valor) as valor_total
FROM pagamento
WHERE status='Pago'
GROUP BY forma_pagamento
ORDER BY valor_total DESC;

-- 6.3 Inserir novo pagamento
INSERT INTO pagamento (id_reserva, data_pagamento, valor, forma_pagamento, status)
VALUES (2, '2026-02-24', 360.00, 'Pix', 'Pago');

-- 6.4 Atualizar status de pagamento
UPDATE pagamento SET status='Pago' 
WHERE status='Pendente';

-- 6.5 Pagamentos pendentes
SELECT id_pagamento, id_reserva, valor, data_pagamento
FROM pagamento
WHERE status='Pendente'
ORDER BY data_pagamento;

-- 6.6 Valor total de pagamentos por mês
SELECT DATE_TRUNC('month', data_pagamento)::date as mes,
       SUM(valor) as total_pago,
       COUNT(*) as quantidade_pagamentos
FROM pagamento
WHERE status='Pago'
GROUP BY DATE_TRUNC('month', data_pagamento)
ORDER BY mes DESC;

-- ============================================
-- 7. TESTES DE JOINS (CONSULTAS COMPLEXAS)
-- ============================================

-- 7.1 Detalhes completos de uma reserva
SELECT r.id_reserva,
       h.nome as hospede,
       h.cpf,
       h.email,
       h.telefone,
       q.numero as quarto_numero,
       q.tipo as tipo_quarto,
       q.valor_diaria,
       f.nome as funcionario_responsavel,
       f.cargo,
       r.data_checkin,
       r.data_checkout,
       r.status,
       r.valor_total
FROM reserva r
JOIN hospede h ON r.cpf_hospede = h.cpf
JOIN quarto q ON r.id_quarto = q.id_quarto
LEFT JOIN funcionario f ON r.id_funcionario = f.id_funcionario
WHERE r.id_reserva = 1;

-- 7.2 Serviços de uma reserva específica
SELECT s.id_servico,
       s.categoria,
       s.quantidade,
       s.valor_unitario,
       (s.quantidade * s.valor_unitario) as subtotal,
       f.nome as realizado_por
FROM servico s
LEFT JOIN funcionario f ON s.id_funcionario = f.id_funcionario
WHERE s.id_reserva = 1
ORDER BY s.id_servico;

-- 7.3 Hóspede com todas suas reservas e últimos pagamentos
SELECT h.cpf, h.nome, h.email,
       r.id_reserva,
       r.data_checkin,
       r.data_checkout,
       r.valor_total as valor_reserva,
       p.forma_pagamento,
       p.data_pagamento,
       p.valor as valor_pagamento,
       p.status as status_pagamento
FROM hospede h
LEFT JOIN reserva r ON h.cpf = r.cpf_hospede
LEFT JOIN pagamento p ON r.id_reserva = p.id_reserva
WHERE h.cpf = '123.456.789-00'
ORDER BY r.data_checkin DESC;

-- 7.4 Ocupação de quartos
SELECT q.numero,
       q.tipo,
       q.status,
       CASE 
           WHEN q.status='Ocupado' THEN h.nome 
           ELSE 'Vago' 
       END as hospede_atual,
       r.data_checkin,
       r.data_checkout
FROM quarto q
LEFT JOIN reserva r ON q.id_quarto = r.id_quarto 
                   AND r.status='Confirmada'
                   AND r.data_checkin <= CURRENT_DATE 
                   AND r.data_checkout >= CURRENT_DATE
LEFT JOIN hospede h ON r.cpf_hospede = h.cpf
ORDER BY q.numero;

-- ============================================
-- 8. TESTES DE RELATÓRIOS
-- ============================================

-- 8.1 Relatório de ocupação por período
SELECT DATE_TRUNC('day', r.data_checkin)::date as data,
       COUNT(DISTINCT r.id_quarto) as quartos_ocupados,
       (SELECT COUNT(*) FROM quarto) as total_quartos,
       ROUND(100.0 * COUNT(DISTINCT r.id_quarto) / (SELECT COUNT(*) FROM quarto), 2) as percentual_ocupacao
FROM reserva r
WHERE r.status='Confirmada'
GROUP BY DATE_TRUNC('day', r.data_checkin)
ORDER BY data DESC
LIMIT 30;

-- 8.2 Receita vs Despesas (Serviços)
SELECT r.id_reserva,
       r.valor_total as receita_reserva,
       COALESCE(SUM(s.valor_unitario * s.quantidade), 0) as despesa_servicos,
       r.valor_total + COALESCE(SUM(s.valor_unitario * s.quantidade), 0) as receita_total
FROM reserva r
LEFT JOIN servico s ON r.id_reserva = s.id_reserva
WHERE r.status != 'Cancelada'
GROUP BY r.id_reserva, r.valor_total
ORDER BY receita_total DESC;

-- 8.3 TOP 5 hóspedes por valor gasto
SELECT h.cpf,
       h.nome,
       COUNT(r.id_reserva) as total_reservas,
       SUM(r.valor_total) as valor_total_reservas,
       COALESCE(SUM(s.valor_unitario * s.quantidade), 0) as total_servicos,
       SUM(r.valor_total) + COALESCE(SUM(s.valor_unitario * s.quantidade), 0) as grand_total
FROM hospede h
LEFT JOIN reserva r ON h.cpf = r.cpf_hospede AND r.status !='Cancelada'
LEFT JOIN servico s ON r.id_reserva = s.id_reserva
GROUP BY h.cpf, h.nome
ORDER BY grand_total DESC
LIMIT 5;

-- 8.4 Faturamento por funcionário (serviços realizados)
SELECT f.id_funcionario,
       f.nome,
       f.cargo,
       COUNT(s.id_servico) as total_servicos,
       SUM(s.valor_unitario * s.quantidade) as faturamento
FROM funcionario f
LEFT JOIN servico s ON f.id_funcionario = s.id_funcionario
GROUP BY f.id_funcionario, f.nome, f.cargo
ORDER BY faturamento DESC;

-- 8.5 Dias de check-in próximos (próximos 7 dias)
SELECT r.id_reserva,
       h.nome as hospede,
       h.telefone,
       q.numero as quarto,
       q.tipo,
       r.data_checkin,
       (r.data_checkin - CURRENT_DATE) as dias_para_checkin
FROM reserva r
JOIN hospede h ON r.cpf_hospede = h.cpf
JOIN quarto q ON r.id_quarto = q.id_quarto
WHERE r.data_checkin BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND r.status='Confirmada'
ORDER BY r.data_checkin;

-- 8.6 Status de pagamentos (resumo)
SELECT status,
       COUNT(*) as quantidade,
       SUM(valor) as valor_total,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM pagamento), 2) as percentual
FROM pagamento
GROUP BY status
ORDER BY quantidade DESC;

-- ============================================
-- 9. TESTES COM CÁLCULOS E ESTATÍSTICAS
-- ============================================

-- 9.1 Estatísticas gerais
SELECT 
    (SELECT COUNT(*) FROM hospede) as total_hospedes,
    (SELECT COUNT(*) FROM funcionario) as total_funcionarios,
    (SELECT COUNT(*) FROM quarto) as total_quartos,
    (SELECT COUNT(*) FROM reserva WHERE status='Confirmada') as reservas_ativas,
    (SELECT SUM(valor_total) FROM reserva WHERE status='Confirmada') as receita_confirmada,
    (SELECT COUNT(*) FROM pagamento WHERE status='Pendente') as pagamentos_pendentes;

-- 9.2 Receita média por reserva
SELECT 
    ROUND(AVG(valor_total), 2) as media_valor_reserva,
    ROUND(MIN(valor_total), 2) as minimo,
    ROUND(MAX(valor_total), 2) as maximo,
    ROUND(STDDEV(valor_total), 2) as desvio_padrao
FROM reserva
WHERE status='Confirmada';

-- 9.3 Quarto com maior ocupação
SELECT q.numero,
       q.tipo,
       COUNT(r.id_reserva) as vezes_reservado,
       ROUND(AVG(EXTRACT(DAY FROM (r.data_checkout - r.data_checkin))), 1) as media_dias_ocupacao
FROM quarto q
LEFT JOIN reserva r ON q.id_quarto = r.id_quarto AND r.status='Confirmada'
GROUP BY q.numero, q.tipo
ORDER BY vezes_reservado DESC;

-- ============================================
-- DICAS DE USO:
-- ============================================
-- 1. Selecione cada script individualmente e execute com F5 ou clique em "Execute"
-- 2. Modifique os parâmetros (datas, CPFs, valores) conforme necessário
-- 3. Scripts deletar estão comentados para evitar acidentes
-- 4. Use Ctrl+Shift+D para formatar o código SQL
-- 5. Consulte os resultados na aba "Data Output"
