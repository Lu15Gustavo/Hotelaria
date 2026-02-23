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
