const API_URL = "/produtos";

const formulario = document.getElementById("form-produto");
const listaProdutos = document.getElementById("lista-produtos");
const produtoId = document.getElementById("produto-id");
const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");

// Listar produtos
async function listarProdutos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os produtos.");
        }

        const produtos = await resposta.json();

        listaProdutos.innerHTML = "";

        if (produtos.length === 0) {
            listaProdutos.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum produto cadastrado.</td>
                </tr>
            `;
            return;
        }

        produtos.forEach(produto => {
            const linha = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = produto.id;

            const nome = document.createElement("td");
            nome.textContent = produto.nome;

            const preco = document.createElement("td");
            preco.textContent = Number(produto.preco).toLocaleString(
                "pt-BR",
                { style: "currency", currency: "BRL" }
            );

            const quantidade = document.createElement("td");
            quantidade.textContent = produto.quantidade;

            const acoes = document.createElement("td");

            const editar = document.createElement("button");
            editar.textContent = "Editar";
            editar.className = "botao-editar";
            editar.addEventListener("click", () => prepararEdicao(produto));

            const excluir = document.createElement("button");
            excluir.textContent = "Excluir";
            excluir.className = "botao-excluir";
            excluir.addEventListener("click", () => excluirProduto(produto.id));

            acoes.appendChild(editar);
            acoes.appendChild(excluir);

            linha.append(id, nome, preco, quantidade, acoes);

            listaProdutos.appendChild(linha);
        });

    } catch (erro) {
        alert(erro.message);
    }
}


// Cadastrar ou editar produto
formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const id = produtoId.value;

    const produto = {
        nome: document.getElementById("nome").value.trim(),
        preco: Number(document.getElementById("preco").value),
        quantidade: Number(document.getElementById("quantidade").value)
    };

    if (!produto.nome || !Number.isFinite(produto.preco) ||
        produto.preco <= 0 || !Number.isInteger(produto.quantidade) ||
        produto.quantidade < 0) {
        alert("Preencha os dados corretamente.");
        return;
    }

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao salvar produto.");
        }

        alert(resultado.mensagem);

        formulario.reset();
        cancelarEdicao();
        listarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
});


// Preparar edição
function prepararEdicao(produto) {
    produtoId.value = produto.id;

    document.getElementById("nome").value = produto.nome;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("quantidade").value = produto.quantidade;

    tituloFormulario.textContent = "Editar Produto";
    botaoSalvar.textContent = "Salvar Alterações";
    botaoCancelar.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Cancelar edição
function cancelarEdicao() {
    formulario.reset();
    produtoId.value = "";

    tituloFormulario.textContent = "Cadastrar Produto";
    botaoSalvar.textContent = "Cadastrar Produto";
    botaoCancelar.hidden = true;
}

botaoCancelar.addEventListener("click", cancelarEdicao);


// Excluir produto
async function excluirProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao excluir produto.");
        }

        alert(resultado.mensagem);
        listarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
}


// Carregar produtos ao abrir a página
listarProdutos();