const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

const filePath = "produtos.json";

// Função para ler os produtos do arquivo JSON
const lerProdutos = () => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath));
};

// Função para salvar os produtos no arquivo JSON
const salvarProdutos = (produtos) => {
    fs.writeFileSync(filePath, JSON.stringify(produtos, null, 2));
};

// Criar um produto
app.post("/produtos", (req, res) => {
    const produtos = lerProdutos();
    const novoProduto = { id: Date.now(), ...req.body };
    produtos.push(novoProduto);
    salvarProdutos(produtos);
    res.status(201).json(novoProduto);
});

// Listar produtos
app.get("/produtos", (req, res) => {
    res.json(lerProdutos());
});

// Atualizar um produto
app.put("/produtos/:id", (req, res) => {
    let produtos = lerProdutos();
    produtos = produtos.map((p) => (p.id == req.params.id ? { ...p, ...req.body } : p));
    salvarProdutos(produtos);
    res.json({ message: "Produto atualizado" });
});

// Excluir um produto
app.delete("/produtos/:id", (req, res) => {
    let produtos = lerProdutos();
    produtos = produtos.filter((p) => p.id != req.params.id);
    salvarProdutos(produtos);
    res.json({ message: "Produto excluído" });
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
