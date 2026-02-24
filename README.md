## 👥 Autor

Projeto desenvolvido para a disciplina de Banco de Dados.
Livia Gandra || Luís Gustavo || Thiago Ker || Tiago Henrique


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


## 📄 Licença

Este projeto é de uso acadêmico.
