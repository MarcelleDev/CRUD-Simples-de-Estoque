const apiUrl = "http://localhost:5000/produtos";

document.addEventListener("DOMContentLoaded", listarProdutos);

document.getElementById("produtoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("produtoId").value;
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;

    const produto = { nome, descricao, preco, quantidade };

    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto),
        });
    } else {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto),
        });
    }

    this.reset();
    document.getElementById("produtoId").value = "";
    listarProdutos();
});

async function listarProdutos() {
    const response = await fetch(apiUrl);
    const produtos = await response.json();

    const lista = document.getElementById("produtoLista");
    lista.innerHTML = "";

    produtos.forEach((produto) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>
                <button class="edit" onclick="editarProduto('${produto._id}', '${produto.nome}', '${produto.descricao}', '${produto.preco}', '${produto.quantidade}')">✏️</button>
                <button class="delete" onclick="excluirProduto('${produto._id}')">🗑</button>
            </td>
        `;

        lista.appendChild(row);
    });
}

function editarProduto(id, nome, descricao, preco, quantidade) {
    document.getElementById("produtoId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("descricao").value = descricao;
    document.getElementById("preco").value = preco;
    document.getElementById("quantidade").value = quantidade;
}

async function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        listarProdutos();
    }
}
