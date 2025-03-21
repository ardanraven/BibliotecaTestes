// Verifica se o usuário está autenticado antes de carregar a biblioteca
const currentMonth = new Date().getMonth();
const storedMonth = localStorage.getItem("month");

if (storedMonth === null || parseInt(storedMonth) !== currentMonth) {
    localStorage.removeItem("auth"); // Remove o login
    localStorage.setItem("month", currentMonth); // Atualiza o mês salvo
    window.location.href = "login.html"; // Redireciona para login
}

if (localStorage.getItem("auth") !== "true") {
    window.location.href = "login.html"; // Redireciona para o login
}

// Links do Apps Script para as bibliotecas
const scriptUrl = "https://script.google.com/macros/s/AKfycbz2KCdiyX_2vLjL2FykazpJegHexdWbQHMprc0DbFXVvrQ62d1VrG5Y21ZYj4YJfJb3UQ/exec"; // Biblioteca principal
const scriptUrlVariados = "https://script.google.com/macros/s/AKfycbyta87I-xp_BTLtpt7jZl29xR9t2GLsDvVDZfSY_Muqa7WB3d3-9nwFClcQntAeKrqxcQ/exec"; // Biblioteca de variados

let pdfData = []; // Variável para armazenar os PDFs
const btnVariados = document.getElementById("variados");
const btnVoltar = document.getElementById("voltar");

// Função para buscar e exibir PDFs
async function getPdfList(url) {
    try {
        let response = await fetch(url);
        pdfData = await response.json();

        console.log("Dados carregados:", pdfData); // Log para depuração
        displayPdfList(pdfData); // Exibir os livros

    } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
    }
}

// Exibir os PDFs na tela
function displayPdfList(data) {
    let pdfList = document.getElementById("pdf-list");
    pdfList.innerHTML = ""; // Limpa a lista antes de carregar novos itens

    data.forEach(file => {
        let pdfItem = document.createElement("div");
        pdfItem.classList.add("pdf-item");

        pdfItem.innerHTML = `
            <img src="${file.thumbnail}" alt="Capa de ${file.name}" class="pdf-thumbnail">
            <p>${file.name}</p>
            <a href="${file.url}" target="_blank">📖 Visualizar</a>
        `;

        pdfList.appendChild(pdfItem);
    });
}

// Função de pesquisa
document.getElementById("search").addEventListener("input", function() {
    let searchTerm = this.value.toLowerCase();
    let filteredData = pdfData.filter(file => file.name.toLowerCase().includes(searchTerm));
    displayPdfList(filteredData);
});

// Carregar PDFs da biblioteca principal no início
getPdfList(scriptUrl);

// Alternar para a pasta de variados
function loadVariados() {
    console.log("Carregando a pasta de variados...");
    
    btnVariados.style.display = "none";
    btnVoltar.style.display = "inline-block";

    getPdfList(scriptUrlVariados); // Carregar PDFs da nova pasta
}

// Voltar para a biblioteca principal
function loadPrincipal() {
    console.log("Voltando para a biblioteca principal...");

    btnVariados.style.display = "inline-block";
    btnVoltar.style.display = "none";

    getPdfList(scriptUrl); // Carregar PDFs da biblioteca principal
}

// Logout do usuário
function logout() {
    localStorage.removeItem("auth"); // Remove a autenticação
    window.location.href = "login.html"; // Redireciona para a tela de login
}
