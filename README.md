# Sistema de Estoque
Projeto desenvolvido em Python como atividade prática de desenvolvimento de software.

## Objetivo

Criar um sistema para auxiliar no controle e gerenciamento de estoque.

## Tecnologias utilizadas

- Python 3.12
- Flask
- SQLite
- HTML
- CSS
- JavaScript
- Docker
- Git
- GitHub

## Como executar o projeto localmente

1. Clone o repositório:

git clone https://github.com/mer6b13/sistema-estoque-.git

2. Entre na pasta:

cd sistema-estoque-

3. Crie um ambiente virtual:

python3 -m venv venv

4. Ative o ambiente virtual

source venv/bin/activate

5. Instale as dependências:

pip install -r backend/requirements.txt

6. Execute a aplicação:

cd backend
python3 app.py

7. Acesse no navegador:

http://127.0.0.1:5000


## Como executar com Docker

### 1. Construir a imagem

docker build -t sistema-estoque .

### 2. Executar o container

docker run -d -p 5000:5000 --name sistema-estoque-container sistema-estoque

### 3. Acessar a aplicação

Abra o navegador e acesse:

http://127.0.0.1:5000

### 4. Verificar o container

docker ps

### 5. Consultar os logs

docker logs sistema-estoque-container

### 6. Parar o container

docker stop sistema-estoque-container

## Autor

João IT4LO