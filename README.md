# 🏨 Sistema de Gerenciamento de Hotelaria

## 📋 Descrição do Projeto

Sistema completo de gerenciamento hoteleiro desenvolvido como projeto prático da disciplina de Banco de Dados. A aplicação permite controlar hóspedes, funcionários, quartos, reservas, pagamentos e serviços através de uma interface web intuitiva, utilizando SQL puro para todas as operações de banco de dados.

## 🎯 Objetivos do Projeto

- Implementar um sistema completo de gerenciamento hoteleiro
- Demonstrar conhecimento prático em modelagem de banco de dados relacional
- Aplicar conceitos de integridade referencial e normalização
- Desenvolver interface web funcional sem uso de ORM
- Utilizar SQL puro para todas as operações (CRUD, JOINs, agregações)

## 🏗️ Arquitetura

### Stack Tecnológica
- **Frontend**: React 18 + Axios
- **Backend**: Node.js + Express.js
- **Banco de Dados**: PostgreSQL 14+
- **Driver BD**: node-postgres (pg)

## 📊 Modelo de Dados

### Entidades Principais

#### 1. **Hospede**
- `cpf` (PK, VARCHAR(14))
- `nome` (VARCHAR(100))
- `telefone` (VARCHAR(20))
- `email` (VARCHAR(100))

#### 2. **Funcionario**
- `id_funcionario` (PK, SERIAL)
- `nome` (VARCHAR(100))
- `cargo` (VARCHAR(50))
- `cpf` (VARCHAR(14), UNIQUE)

#### 3. **Quarto**
- `id_quarto` (PK, SERIAL)
- `numero` (INT, UNIQUE)
- `tipo` (VARCHAR(50))
- `capacidade` (INT)
- `valor_diaria` (NUMERIC(10,2))
- `status` (VARCHAR(20))

#### 4. **Reserva**
- `id_reserva` (PK, SERIAL)
- `cpf_hospede` (FK → Hospede)
- `id_quarto` (FK → Quarto)
- `id_funcionario` (FK → Funcionario, NULLABLE)
- `data_checkin` (DATE)
- `data_checkout` (DATE)
- `status` (VARCHAR(20))
- `valor_total` (NUMERIC(10,2))

#### 5. **Servico**
- `id_servico` (PK, SERIAL)
- `id_reserva` (FK → Reserva, ON DELETE CASCADE)
- `id_funcionario` (FK → Funcionario, NULLABLE)
- `valor_unitario` (NUMERIC(10,2))
- `categoria` (VARCHAR(50))
- `quantidade` (INT, DEFAULT 1)

#### 6. **Pagamento**
- `id_pagamento` (PK, SERIAL)
- `id_reserva` (FK → Reserva)
- `data_pagamento` (DATE)
- `valor` (NUMERIC(10,2))
- `forma_pagamento` (VARCHAR(50))
- `status` (VARCHAR(20))

### Relacionamentos
- Hospede 1:N Reserva
- Quarto 1:N Reserva
- Funcionario 1:N Reserva (responsável)
- Funcionario 1:N Servico (executor)
- Reserva 1:N Servico
- Reserva 1:N Pagamento

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ e npm
- PostgreSQL 14+
- PGAdmin 4 (opcional, para testes SQL)

### 1. Configurar Banco de Dados

```bash
# Criar banco de dados no PostgreSQL
createdb hotelaria

# OU no psql:
CREATE DATABASE hotelaria;
```

**Importante**: O schema é criado automaticamente pelas migrations do backend na primeira execução.

### 2. Backend

```bash
# Entrar na pasta backend
cd Hotelaria/backend

# Instalar dependências
npm install

# Configurar credenciais do banco em index.js (linhas 10-16)
# Altere: user, password, database, port conforme sua instalação

# Iniciar servidor
npm start
```

O backend rodará em `http://localhost:5000` e criará automaticamente as colunas ausentes no banco.

### 3. Frontend

```bash
# Entrar na pasta frontend (em outro terminal)
cd Hotelaria/frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm start
```

O frontend abrirá automaticamente em `http://localhost:3000`.

## 🔧 Funcionalidades Implementadas

### Módulo Hóspedes
- ✅ Cadastro, edição e exclusão
- ✅ Listagem com ordenação por nome
- ✅ Busca por nome (LIKE)
- ✅ Detalhes com histórico de reservas

### Módulo Quartos
- ✅ Cadastro com tipo, capacidade, valor
- ✅ Controle de status (Livre/Ocupado)
- ✅ Busca por número
- ✅ Detalhes com hóspedes atuais

### Módulo Funcionários
- ✅ Cadastro com cargo e CPF
- ✅ Associação a reservas e serviços
- ✅ Listagem completa

### Módulo Reservas
- ✅ Criação com validação de datas
- ✅ Atualização automática do status do quarto
- ✅ Cálculo de valor total
- ✅ Associação com funcionário responsável
- ✅ Busca por ID, CPF ou nome
- ✅ Detalhes completos (hóspede, quarto, pagamentos, serviços)

### Módulo Serviços
- ✅ Cadastro vinculado a reservas
- ✅ Quantidade e valor unitário
- ✅ Associação com funcionário executor
- ✅ Cálculo automático de subtotais

### Módulo Pagamentos
- ✅ Múltiplas formas de pagamento (Cartão, Dinheiro, Pix)
- ✅ Controle de status (Pago/Pendente/Cancelado)
- ✅ Vinculação a reservas
- ✅ Detalhes com informações da reserva

## 🎨 Interface do Sistema

### Telas Principais
1. **Dashboard de Hóspedes**: Lista, busca e detalhes
2. **Gestão de Quartos**: Visualização de disponibilidade e ocupação
3. **Central de Reservas**: Criação, edição e consulta detalhada
4. **Serviços Adicionais**: Registro de consumo dos hóspedes
5. **Controle de Pagamentos**: Acompanhamento financeiro

### Recursos da Interface
- 🎯 Navegação por abas
- 🔍 Busca em tempo real
- 📊 Detalhes expandidos (modais)
- ✏️ Formulários validados
- 🎨 Design responsivo com gradientes
- ⚡ Feedback visual de operações

## 🐛 Problemas Encontrados e Soluções

### Problema 1: Incompatibilidade de Schema
**Descrição**: Backend esperava colunas que não existiam no banco original (`id_funcionario` em `reserva`, `id_reserva` em `servico`).

**Erro**:
```
error: coluna "id_funcionario" não existe
code: '42703'
```

**Solução**: Implementação de migrations automáticas no startup do backend:
```javascript
const ensureSchemaCompatibility = async () => {
  await pool.query('ALTER TABLE reserva ADD COLUMN IF NOT EXISTS id_funcionario INT...');
  await pool.query('ALTER TABLE servico ADD COLUMN IF NOT EXISTS id_reserva INT...');
};
```

### Problema 2: Tipo de Dados em Buscas
**Descrição**: Busca de quarto por número falhava ao usar `LIKE` em coluna `integer`.

**Erro**:
```
error: operador não existe: integer ~~ unknown
code: '42883'
```

**Solução**: Cast explícito para texto:
```sql
WHERE numero::text LIKE $1
```

### Problema 3: Validação de Chaves Estrangeiras
**Descrição**: Frontend enviava CPFs/IDs inexistentes, causando violação de FK.

**Erro**:
```
error: inserção viola restrição "reserva_cpf_hospede_fkey"
code: '23503'
```

**Solução**: Validação client-side antes do envio:
```javascript
const hospedeExiste = hospedes.some(h => h.cpf === cpfHospede);
if (!hospedeExiste) {
  alert('CPF do hóspede não encontrado...');
  return;
}
```

### Problema 4: Formatação de Valores Monetários
**Descrição**: `toFixed()` falhava quando `valor_total` vinha como string do PostgreSQL.

**Erro**:
```
TypeError: _s$valor_total.toFixed is not a function
```

**Solução**: Função de formatação segura:
```javascript
const formatMoney = (value) => {
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? '0.00' : numericValue.toFixed(2);
};
```

### Problema 5: Porta em Uso (EADDRINUSE)
**Descrição**: Tentativa de iniciar backend com porta 5000 já ocupada.

**Solução**: Handler de erro no startup:
```javascript
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('A porta 5000 já está em uso...');
  }
  process.exit(1);
});
```

**Comando para liberar porta** (Windows):
```powershell
Get-NetTCPConnection -LocalPort 5000 | 
  Select-Object -ExpandProperty OwningProcess -Unique | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```

## 📝 Decisões de Projeto

### 1. Não Utilização de ORM
**Justificativa**: Requisito acadêmico exige SQL puro para demonstrar conhecimento da linguagem.

**Implementação**: Todas as queries são escritas manualmente usando `pool.query()`:
```javascript
await pool.query(
  'INSERT INTO hospede (cpf, nome, telefone, email) VALUES ($1, $2, $3, $4)',
  [cpf, nome, telefone, email]
);
```

### 2. Migrations Automáticas
**Justificativa**: Facilitar compatibilidade entre versões do schema sem exigir recriação do banco.

**Abordagem**: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` no startup.

### 3. Validação em Dupla Camada
- **Frontend**: Validação imediata para UX (CPF válido, datas coerentes)
- **Backend**: Validação de segurança (formato de dados, FKs existentes)

### 4. Status de Quarto Automático
Quando uma reserva é criada/alterada, o status do quarto é atualizado automaticamente:
- Confirmada → Ocupado
- Cancelada/Finalizada → Livre

## 📚 Requisitos Atendidos

| Requisito | Status | Comprovação |
|-----------|--------|-------------|
| Interface web/mobile/desktop | ✅ | Frontend React (web) |
| Acesso via linguagem de programação | ✅ | Node.js + Express |
| Sem CLI ou ferramentas admin | ✅ | Interface gráfica completa |
| CRUD completo | ✅ | 6 entidades com todas operações |
| Consultas SQL escritas manualmente | ✅ | Todas em `backend/index.js` |
| Sem ORM/APIs que substituam SQL | ✅ | Apenas driver `pg` |
| JOINs e consultas complexas | ✅ | Detalhes, buscas, relatórios |
| Integridade referencial | ✅ | FKs, ON DELETE CASCADE |

## 🧪 Testes

### Scripts SQL Disponíveis
O arquivo `testes_sql.sql` contém mais de 50 queries de teste organizadas em seções:
1. CRUD de todas entidades
2. JOINs complexos (3-4 tabelas)
3. Agregações e estatísticas
4. Relatórios gerenciais
5. Consultas analíticas

### Como Testar
1. Abra PGAdmin 4
2. Conecte ao banco `hotelaria`
3. Abra o arquivo `testes_sql.sql`
4. Execute queries individualmente (F5)

## 📖 Aprendizados

### Técnicos
- Gestão de conexões de banco com pooling
- Prepared statements para segurança (SQL Injection)
- Tratamento de erros específicos do PostgreSQL
- Validação de integridade antes de operações
- Migrations sem ferramentas externas

### Arquiteturais
- Separação de responsabilidades (frontend/backend)
- API RESTful com rotas semânticas
- Versionamento de schema do banco
- Feedback claro de erros ao usuário

### Boas Práticas
- Parametrização de queries (evita SQL Injection)
- Normalização até 3FN
- Índices implícitos em PKs e FKs
- Constraints para garantir integridade

## 🔐 Segurança

### Implementado
- ✅ Prepared statements (queries parametrizadas)
- ✅ Validação de tipos de dados
- ✅ CORS configurado
- ✅ Tratamento de erros sem expor stack traces ao cliente

### Melhorias Futuras
- [ ] Autenticação e autorização
- [ ] Variáveis de ambiente para credenciais
- [ ] Rate limiting
- [ ] Sanitização extra de inputs
- [ ] HTTPS

## 🚧 Limitações Conhecidas

1. **Credenciais hardcoded**: Senha do banco está no código (dev only)
2. **Sem autenticação**: Qualquer um pode acessar todas funcionalidades
3. **Validação básica**: Aceita qualquer formato de CPF/telefone
4. **Sem paginação**: Listas podem ficar lentas com muitos registros
5. **Migrations simples**: Não há rollback automático

## 📈 Melhorias Futuras

- [ ] Sistema de autenticação (JWT)
- [ ] Paginação de listagens
- [ ] Export de relatórios (PDF/Excel)
- [ ] Dashboard com gráficos
- [ ] Notificações de check-in/check-out
- [ ] Histórico de alterações (audit log)
- [ ] Reservas online (cliente final)
- [ ] Integração com gateway de pagamento

## 👥 Autor

Projeto desenvolvido para a disciplina de Banco de Dados.

## 📄 Licença

Este projeto é de uso acadêmico.
