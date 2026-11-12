from flask import Flask, jsonify, request, send_from_directory
from database import conectar, criar_tabela

app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)

# Criar banco de dados e tabela
criar_tabela()


# Rota inicial
@app.route("/", methods=["GET"])
def inicio():
    return send_from_directory(app.static_folder, "index.html") # type: ignore
# CADASTRAR PRODUTO
@app.route("/produtos", methods=["POST"])
def cadastrar_produto():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "Envie os dados do produto em JSON."}), 400

    nome = dados.get("nome")
    preco = dados.get("preco")
    quantidade = dados.get("quantidade")

    if not isinstance(nome, str) or not nome.strip():
        return jsonify({"erro": "O nome do produto é obrigatório."}), 400

    if isinstance(preco, bool) or not isinstance(preco, (int, float)) or preco <= 0:
        return jsonify({"erro": "O preço deve ser maior que zero."}), 400

    if isinstance(quantidade, bool) or not isinstance(quantidade, int) or quantidade < 0:
        return jsonify({"erro": "A quantidade deve ser um número inteiro não negativo."}), 400

    conexao = conectar()

    cursor = conexao.execute(
        """
        INSERT INTO produtos (nome, preco, quantidade)
        VALUES (?, ?, ?)
        """,
        (nome.strip(), preco, quantidade)
    )

    conexao.commit()
    produto_id = cursor.lastrowid
    conexao.close()

    return jsonify({
        "mensagem": "Produto cadastrado com sucesso!",
        "id": produto_id
    }), 201


# LISTAR PRODUTOS
@app.route("/produtos", methods=["GET"])
def listar_produtos():
    conexao = conectar()

    produtos = conexao.execute(
        "SELECT * FROM produtos"
    ).fetchall()

    conexao.close()

    return jsonify([dict(produto) for produto in produtos])


# BUSCAR PRODUTO POR ID
@app.route("/produtos/<int:id>", methods=["GET"])
def buscar_produto(id):
    conexao = conectar()

    produto = conexao.execute(
        "SELECT * FROM produtos WHERE id = ?",
        (id,)
    ).fetchone()

    conexao.close()

    if produto is None:
        return jsonify({"erro": "Produto não encontrado."}), 404

    return jsonify(dict(produto))


# EDITAR PRODUTO
@app.route("/produtos/<int:id>", methods=["PUT"])
def editar_produto(id):
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "Envie os dados em JSON."}), 400

    nome = dados.get("nome")
    preco = dados.get("preco")
    quantidade = dados.get("quantidade")

    if not isinstance(nome, str) or not nome.strip():
        return jsonify({"erro": "O nome do produto é obrigatório."}), 400

    if isinstance(preco, bool) or not isinstance(preco, (int, float)) or preco <= 0:
        return jsonify({"erro": "O preço deve ser maior que zero."}), 400

    if isinstance(quantidade, bool) or not isinstance(quantidade, int) or quantidade < 0:
        return jsonify({"erro": "A quantidade deve ser um número inteiro não negativo."}), 400

    conexao = conectar()

    cursor = conexao.execute(
        """
        UPDATE produtos
        SET nome = ?, preco = ?, quantidade = ?
        WHERE id = ?
        """,
        (nome.strip(), preco, quantidade, id)
    )

    conexao.commit()
    atualizado = cursor.rowcount
    conexao.close()

    if atualizado == 0:
        return jsonify({"erro": "Produto não encontrado."}), 404

    return jsonify({"mensagem": "Produto atualizado com sucesso!"})


# EXCLUIR PRODUTO
@app.route("/produtos/<int:id>", methods=["DELETE"])
def excluir_produto(id):
    conexao = conectar()

    cursor = conexao.execute(
        "DELETE FROM produtos WHERE id = ?",
        (id,)
    )

    conexao.commit()
    excluido = cursor.rowcount
    conexao.close()

    if excluido == 0:
        return jsonify({"erro": "Produto não encontrado."}), 404

    return jsonify({"mensagem": "Produto excluído com sucesso!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
