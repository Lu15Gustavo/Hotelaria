import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hotelaria',
  password: '12345678',
  port: 5432
});

const emptyToNull = (value) => (value === '' || value === undefined ? null : value);

const ensureSchemaCompatibility = async () => {
  await pool.query('ALTER TABLE reserva ADD COLUMN IF NOT EXISTS id_funcionario INT REFERENCES funcionario(id_funcionario)');
  await pool.query('ALTER TABLE servico ADD COLUMN IF NOT EXISTS id_reserva INT REFERENCES reserva(id_reserva) ON DELETE CASCADE');
  await pool.query('ALTER TABLE servico ADD COLUMN IF NOT EXISTS id_funcionario INT REFERENCES funcionario(id_funcionario)');
  await pool.query('ALTER TABLE servico ADD COLUMN IF NOT EXISTS quantidade INT DEFAULT 1');
};

// Hóspedes
app.get('/hospedes', async (req, res) => {
  try {
    const result = await pool.query('SELECT cpf, nome, telefone, email FROM hospede ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar hóspedes' });
  }
});

app.post('/hospedes', async (req, res) => {
  try {
    const { cpf, nome, telefone, email } = req.body;
    await pool.query('INSERT INTO hospede (cpf, nome, telefone, email) VALUES ($1, $2, $3, $4)', [cpf, nome, telefone, email]);
    res.status(201).json({ message: 'Hóspede criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar hóspede' });
  }
});

app.put('/hospedes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const { nome, telefone, email } = req.body;
    await pool.query('UPDATE hospede SET nome=$1, telefone=$2, email=$3 WHERE cpf=$4', [nome, telefone, email, cpf]);
    res.json({ message: 'Hóspede atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar hóspede' });
  }
});

app.delete('/hospedes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    await pool.query('DELETE FROM hospede WHERE cpf=$1', [cpf]);
    res.json({ message: 'Hóspede removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover hóspede' });
  }
});

// Funcionários
app.get('/funcionarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_funcionario, nome, cargo, cpf FROM funcionario ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

app.post('/funcionarios', async (req, res) => {
  try {
    const { nome, cargo, cpf } = req.body;
    await pool.query('INSERT INTO funcionario (nome, cargo, cpf) VALUES ($1, $2, $3)', [nome, cargo, cpf]);
    res.status(201).json({ message: 'Funcionário criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
});

app.put('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cargo, cpf } = req.body;
    await pool.query('UPDATE funcionario SET nome=$1, cargo=$2, cpf=$3 WHERE id_funcionario=$4', [nome, cargo, cpf, id]);
    res.json({ message: 'Funcionário atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

app.delete('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM funcionario WHERE id_funcionario=$1', [id]);
    res.json({ message: 'Funcionário removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover funcionário' });
  }
});

// Quartos
app.get('/quartos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_quarto, numero, tipo, capacidade, valor_diaria, status FROM quarto ORDER BY numero');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar quartos' });
  }
});

app.post('/quartos', async (req, res) => {
  try {
    const { numero, tipo, capacidade, valor_diaria, status } = req.body;
    await pool.query('INSERT INTO quarto (numero, tipo, capacidade, valor_diaria, status) VALUES ($1, $2, $3, $4, $5)', [numero, tipo, capacidade, valor_diaria, status]);
    res.status(201).json({ message: 'Quarto criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar quarto' });
  }
});

app.put('/quartos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, tipo, capacidade, valor_diaria, status } = req.body;
    await pool.query('UPDATE quarto SET numero=$1, tipo=$2, capacidade=$3, valor_diaria=$4, status=$5 WHERE id_quarto=$6', [numero, tipo, capacidade, valor_diaria, status, id]);
    res.json({ message: 'Quarto atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar quarto' });
  }
});

app.delete('/quartos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM quarto WHERE id_quarto=$1', [id]);
    res.json({ message: 'Quarto removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover quarto' });
  }
});

// Serviços
app.get('/servicos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_servico, id_reserva, id_funcionario, valor_unitario, categoria, quantidade FROM servico ORDER BY id_reserva DESC, categoria');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

app.post('/servicos', async (req, res) => {
  try {
    const { id_reserva, id_funcionario, valor_unitario, categoria, quantidade } = req.body;
    await pool.query('INSERT INTO servico (id_reserva, id_funcionario, valor_unitario, categoria, quantidade) VALUES ($1, $2, $3, $4, $5)', [id_reserva, id_funcionario, valor_unitario, categoria, quantidade || 1]);
    res.status(201).json({ message: 'Serviço criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
});

app.put('/servicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_reserva, id_funcionario, valor_unitario, categoria, quantidade } = req.body;
    await pool.query('UPDATE servico SET id_reserva=$1, id_funcionario=$2, valor_unitario=$3, categoria=$4, quantidade=$5 WHERE id_servico=$6', [id_reserva, id_funcionario, valor_unitario, categoria, quantidade || 1, id]);
    res.json({ message: 'Serviço atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

app.delete('/servicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM servico WHERE id_servico=$1', [id]);
    res.json({ message: 'Serviço removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover serviço' });
  }
});

// Reservas
app.get('/reservas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_reserva, cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total FROM reserva ORDER BY data_checkin DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

app.post('/reservas', async (req, res) => {
  try {
    const cpf_hospede = emptyToNull(req.body.cpf_hospede);
    const id_quarto = emptyToNull(req.body.id_quarto);
    const id_funcionario = emptyToNull(req.body.id_funcionario);
    const data_checkin = emptyToNull(req.body.data_checkin);
    const data_checkout = emptyToNull(req.body.data_checkout);
    const status = emptyToNull(req.body.status) || 'Confirmada';
    const valor_total = emptyToNull(req.body.valor_total);

    if (!cpf_hospede || !id_quarto || !data_checkin || !data_checkout) {
      return res.status(400).json({ error: 'Campos obrigatórios: cpf_hospede, id_quarto, data_checkin e data_checkout' });
    }

    if (new Date(data_checkout) < new Date(data_checkin)) {
      return res.status(400).json({ error: 'data_checkout não pode ser menor que data_checkin' });
    }

    const result = await pool.query('INSERT INTO reserva (cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_reserva', [cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total]);
    // Se a reserva estiver confirmada (ou não cancelada), marque o quarto como ocupado
    if (status && status.toLowerCase() !== 'cancelada') {
      await pool.query("UPDATE quarto SET status=$1 WHERE id_quarto=$2", ['Ocupado', id_quarto]);
    }
    res.status(201).json({ message: 'Reserva criada com sucesso!', id_reserva: result.rows[0].id_reserva });
  } catch (err) {
    console.error(err);
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Formato inválido para número ou data em algum campo da reserva' });
    }
    if (err.code === '23503') {
      return res.status(400).json({ error: 'CPF do hóspede, quarto ou funcionário não existe' });
    }
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
});

app.put('/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cpf_hospede = emptyToNull(req.body.cpf_hospede);
    const id_quarto = emptyToNull(req.body.id_quarto);
    const id_funcionario = emptyToNull(req.body.id_funcionario);
    const data_checkin = emptyToNull(req.body.data_checkin);
    const data_checkout = emptyToNull(req.body.data_checkout);
    const status = emptyToNull(req.body.status);
    const valor_total = emptyToNull(req.body.valor_total);

    if (!cpf_hospede || !id_quarto || !data_checkin || !data_checkout) {
      return res.status(400).json({ error: 'Campos obrigatórios: cpf_hospede, id_quarto, data_checkin e data_checkout' });
    }

    if (new Date(data_checkout) < new Date(data_checkin)) {
      return res.status(400).json({ error: 'data_checkout não pode ser menor que data_checkin' });
    }

    await pool.query('UPDATE reserva SET cpf_hospede=$1, id_quarto=$2, id_funcionario=$3, data_checkin=$4, data_checkout=$5, status=$6, valor_total=$7 WHERE id_reserva=$8', [cpf_hospede, id_quarto, id_funcionario, data_checkin, data_checkout, status, valor_total, id]);
    // Ajustar status do quarto conforme o novo status da reserva
    if (status) {
      const low = status.toLowerCase();
      if (low === 'confirmada') {
        await pool.query('UPDATE quarto SET status=$1 WHERE id_quarto=$2', ['Ocupado', id_quarto]);
      } else if (low === 'cancelada' || low === 'finalizada') {
        await pool.query('UPDATE quarto SET status=$1 WHERE id_quarto=$2', ['Livre', id_quarto]);
      }
    }
    res.json({ message: 'Reserva atualizada' });
  } catch (err) {
    console.error(err);
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Formato inválido para número ou data em algum campo da reserva' });
    }
    if (err.code === '23503') {
      return res.status(400).json({ error: 'CPF do hóspede, quarto ou funcionário não existe' });
    }
    res.status(500).json({ error: 'Erro ao atualizar reserva' });
  }
});

app.delete('/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Buscar reserva antes de deletar para possivelmente liberar o quarto
    const r = await pool.query('SELECT id_reserva, id_quarto, status FROM reserva WHERE id_reserva=$1', [id]);
    if (r.rows && r.rows.length > 0) {
      const reserva = r.rows[0];
      await pool.query('DELETE FROM reserva WHERE id_reserva=$1', [id]);
      // Se reserva não era cancelada, libere o quarto (simplificação)
      if (reserva.status && reserva.status.toLowerCase() !== 'cancelada') {
        await pool.query('UPDATE quarto SET status=$1 WHERE id_quarto=$2', ['Livre', reserva.id_quarto]);
      }
      return res.json({ message: 'Reserva removida' });
    }
    res.status(404).json({ error: 'Reserva não encontrada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover reserva' });
  }
});

// Pagamentos
app.get('/pagamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_pagamento, id_reserva, data_pagamento, valor, forma_pagamento, status FROM pagamento ORDER BY data_pagamento DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pagamentos' });
  }
});

app.post('/pagamentos', async (req, res) => {
  try {
    const { id_reserva, data_pagamento, valor, forma_pagamento, status } = req.body;
    await pool.query('INSERT INTO pagamento (id_reserva, data_pagamento, valor, forma_pagamento, status) VALUES ($1, $2, $3, $4, $5)', [id_reserva, data_pagamento, valor, forma_pagamento, status]);
    res.status(201).json({ message: 'Pagamento criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

app.put('/pagamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_reserva, data_pagamento, valor, forma_pagamento, status } = req.body;
    await pool.query('UPDATE pagamento SET id_reserva=$1, data_pagamento=$2, valor=$3, forma_pagamento=$4, status=$5 WHERE id_pagamento=$6', [id_reserva, data_pagamento, valor, forma_pagamento, status, id]);
    res.json({ message: 'Pagamento atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar pagamento' });
  }
});

app.delete('/pagamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pagamento WHERE id_pagamento=$1', [id]);
    res.json({ message: 'Pagamento removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover pagamento' });
  }
});


app.get('/hospedes/:cpf/detalhes', async (req, res) => {
  try {
    const { cpf } = req.params;
    const hospede = await pool.query('SELECT cpf, nome, telefone, email FROM hospede WHERE cpf=$1', [cpf]);
    if (!hospede.rows || hospede.rows.length === 0) {
      return res.status(404).json({ error: 'Hóspede não encontrado' });
    }
    const reservas = await pool.query(
      `SELECT r.id_reserva, r.data_checkin, r.data_checkout, r.status, r.valor_total, q.numero, q.tipo 
       FROM reserva r JOIN quarto q ON r.id_quarto = q.id_quarto 
       WHERE r.cpf_hospede=$1 ORDER BY r.data_checkin DESC`, 
      [cpf]
    );
    res.json({ hospede: hospede.rows[0], reservas: reservas.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar detalhes' });
  }
});

// Busca de Hóspede por Nome
app.get('/hospedes/buscar/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const result = await pool.query(
      'SELECT cpf, nome, telefone, email FROM hospede WHERE LOWER(nome) LIKE LOWER($1) ORDER BY nome',
      [`%${nome}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar hóspedes' });
  }
});

// Detalhes de Quarto com Reservas Atuais
app.get('/quartos/:id/detalhes', async (req, res) => {
  try {
    const { id } = req.params;
    const quarto = await pool.query(
      'SELECT id_quarto, numero, tipo, capacidade, valor_diaria, status FROM quarto WHERE id_quarto=$1', 
      [id]
    );
    if (!quarto.rows || quarto.rows.length === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    const reservas = await pool.query(
      `SELECT r.id_reserva, r.cpf_hospede, h.nome, r.data_checkin, r.data_checkout, r.status, r.valor_total
       FROM reserva r JOIN hospede h ON r.cpf_hospede = h.cpf 
       WHERE r.id_quarto=$1 AND r.status != 'Cancelada' ORDER BY r.data_checkin DESC`, 
      [id]
    );
    res.json({ quarto: quarto.rows[0], reservas: reservas.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar detalhes' });
  }
});

// Busca de Quarto por Número
app.get('/quartos/buscar/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await pool.query(
      'SELECT id_quarto, numero, tipo, capacidade, valor_diaria, status FROM quarto WHERE numero::text LIKE $1 ORDER BY numero',
      [`%${numero}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar quartos' });
  }
});

// Detalhes de Reserva com Hóspede, Quarto e Funcionário
app.get('/reservas/:id/detalhes', async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await pool.query(
      `SELECT r.id_reserva, r.cpf_hospede, h.nome as hospede_nome, h.email, h.telefone,
              r.id_quarto, q.numero as quarto_numero, q.tipo as quarto_tipo,
              r.id_funcionario, f.nome as funcionario_nome, f.cargo,
              r.data_checkin, r.data_checkout, r.status, r.valor_total
       FROM reserva r 
       JOIN hospede h ON r.cpf_hospede = h.cpf 
       JOIN quarto q ON r.id_quarto = q.id_quarto 
       LEFT JOIN funcionario f ON r.id_funcionario = f.id_funcionario 
       WHERE r.id_reserva=$1`, 
      [id]
    );
    if (!reserva.rows || reserva.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    const pagamentos = await pool.query(
      'SELECT id_pagamento, data_pagamento, valor, forma_pagamento, status FROM pagamento WHERE id_reserva=$1 ORDER BY data_pagamento DESC',
      [id]
    );
    const servicos = await pool.query(
      `SELECT s.id_servico, s.id_funcionario, f.nome as funcionario_nome, s.valor_unitario, s.categoria, s.quantidade, (s.quantidade * s.valor_unitario) as valor_total
       FROM servico s
       LEFT JOIN funcionario f ON s.id_funcionario = f.id_funcionario
       WHERE s.id_reserva = $1
       ORDER BY s.id_servico`,
      [id]
    );
    res.json({ reserva: reserva.rows[0], pagamentos: pagamentos.rows, servicos: servicos.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar detalhes' });
  }
});

// Busca de Reserva por ID ou CPF
app.get('/reservas/buscar/:termo', async (req, res) => {
  try {
    const { termo } = req.params;
    const result = await pool.query(
      `SELECT r.id_reserva, r.cpf_hospede, h.nome, q.numero as quarto_numero,
              r.id_funcionario, f.nome as funcionario_nome,
              r.data_checkin, r.data_checkout, r.status, r.valor_total
       FROM reserva r 
       JOIN hospede h ON r.cpf_hospede = h.cpf 
       JOIN quarto q ON r.id_quarto = q.id_quarto 
       LEFT JOIN funcionario f ON r.id_funcionario = f.id_funcionario 
       WHERE r.id_reserva::text LIKE $1 OR LOWER(h.nome) LIKE LOWER($2) OR r.cpf_hospede LIKE $3
       ORDER BY r.data_checkin DESC`,
      [`%${termo}%`, `%${termo}%`, `%${termo}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

// Detalhes de Pagamento com Reserva e Hóspede
app.get('/pagamentos/:id/detalhes', async (req, res) => {
  try {
    const { id } = req.params;
    const pagamento = await pool.query(
      `SELECT p.id_pagamento, p.data_pagamento, p.valor, p.forma_pagamento, p.status,
              p.id_reserva, r.cpf_hospede, h.nome as hospede_nome,
              q.numero as quarto_numero, r.data_checkin, r.data_checkout
       FROM pagamento p 
       JOIN reserva r ON p.id_reserva = r.id_reserva 
       JOIN hospede h ON r.cpf_hospede = h.cpf 
       JOIN quarto q ON r.id_quarto = q.id_quarto 
       WHERE p.id_pagamento=$1`, 
      [id]
    );
    if (!pagamento.rows || pagamento.rows.length === 0) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    res.json(pagamento.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar detalhes' });
  }
});

const startServer = async () => {
  try {
    await ensureSchemaCompatibility();
    const server = app.listen(5000, () => {
      console.log('Backend rodando na porta 5000');
      console.log('Compatibilidade de schema verificada');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('A porta 5000 já está em uso. Encerre o processo antigo antes de iniciar o backend.');
      } else {
        console.error('Erro ao iniciar servidor:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Falha ao validar schema do banco:', err);
    process.exit(1);
  }
};

startServer();

