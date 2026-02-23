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

// Hóspedes
app.get('/hospedes', async (req, res) => {
  const result = await pool.query('SELECT cpf, nome, telefone, email FROM hospede');
  res.json(result.rows);
});

app.post('/hospedes', async (req, res) => {
  const { cpf, nome, telefone, email } = req.body;
  await pool.query('INSERT INTO hospede (cpf, nome, telefone, email) VALUES ($1, $2, $3, $4)', [cpf, nome, telefone, email]);
  res.status(201).json({ message: 'Hóspede criado com sucesso!' });
});

// Outras rotas podem ser adicionadas aqui para funcionarios, quartos, reservas, pagamentos, serviços

app.listen(5000, () => {
  console.log('Backend rodando na porta 5000');
});
