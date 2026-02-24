# Projeto Hotelaria

Resumo rápido
- Sistema de exemplo para o projeto prático de Banco de Dados (disciplina).
- Banco de dados: PostgreSQL (scripts em `hotelaria.sql`).
- Interface: backend em Node.js (Express) que usa o driver `pg` para executar SQL diretamente (NÃO usa ORM).

Pré-requisitos
- PostgreSQL instalado e em execução.
- Node.js 18+ e npm.

Instalar e popular o banco (PostgreSQL)
1. Crie o banco (se necessário):

```psql
createdb hotelaria
```

2. Rode o script SQL que cria as tabelas e popula os dados:

```bash
psql -U <seu_usuario> -d hotelaria -f "c:/Users/luisb/OneDrive/Desktop/Trab_BD/Hotelaria/hotelaria.sql"
```

Substitua `<seu_usuario>` pelo usuário do PostgreSQL (ex.: `postgres`).

Backend
1. Vá para a pasta `backend` e instale dependências:

```bash
cd Hotelaria/backend
npm install
```

2. Ajuste as credenciais de conexão em `backend/index.js` ou prefira usar variáveis de ambiente.

3. Inicie o backend:

```bash
npm start
# ou em desenvolvimento
npm run dev
```

Endpoints disponíveis (exemplo)
- `GET /hospedes` - lista hóspedes
- `POST /hospedes` - cria hóspede (body: `cpf, nome, telefone, email`)

Frontend
1. Vá para `Hotelaria/frontend` e instale:

```bash
cd Hotelaria/frontend
npm install
npm start
```

Observações importantes para entrega
- O projeto cumpre o requisito de NÃO usar ORM; o backend usa `pg` e executa SQL manualmente.
- Inclua no repositório: scripts SQL (`hotelaria.sql`), código fonte (`backend/`, `frontend/`), diagrama ER e `README.md`.
- Grave um vídeo (≤15 min) mostrando: problema, diagrama ER, decisões de projeto e a aplicação em execução.

Segurança e melhorias sugeridas
- Não deixe credenciais em código: use variáveis de ambiente (ex.: `process.env.PGUSER`, `PGPASSWORD`).
- Adicionar `.venv` em `.gitignore` se houver ambientes Python locais.

Se quiser, eu:
- atualizo `index.js` para usar variáveis de ambiente; ou
- gero um `README` mais detalhado com instruções de ambiente e roteiros para a apresentação.
# Hotelaria - Sistema Completo

Este projeto contém um sistema de hotelaria com backend em Python (Flask), frontend em React e banco de dados PostgreSQL (PGAdmin 4).

## Estrutura do Projeto
- **hotelaria.sql**: Script para criar as tabelas no PostgreSQL
- **backend/**: API Flask para gerenciar hóspedes, funcionários, quartos, reservas, pagamentos e serviços
- **frontend/**: Aplicação React para interface do gerente

## Como rodar o projeto

### 1. Banco de Dados
- Importe o arquivo `hotelaria.sql` no PGAdmin 4 para criar as tabelas.
- Configure um banco chamado `hotelaria`.

### 2. Backend (Flask)
- Entre na pasta `backend`
- Instale as dependências:
	```bash
	pip install flask flask-cors psycopg2-binary
	```
- Configure o acesso ao banco em `backend/app.py`
- Rode o backend:
	```bash
	python app.py
	```

### 3. Frontend (React)
- Entre na pasta `frontend`
- Instale as dependências:
	```bash
	npm install
	```
- Rode o frontend:
	```bash
	npm start
	```

---

## Entidades do Sistema
- Hóspede
- Funcionário
- Quarto
- Reserva
- Pagamento
- Serviço

---

Siga as instruções acima para rodar o sistema. Dúvidas? Só perguntar!
# Hotelaria
Hotelaria
