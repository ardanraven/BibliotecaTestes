const adminUser = "admin";
const adminPass = "oculta2025";
let users = JSON.parse(localStorage.getItem("users")) || [];

// Função para login de admin
function adminLogin() {
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;
    if (user === adminUser && pass === adminPass) {
        localStorage.setItem("adminAuth", "true");
        window.location.href = "admin.html";
    } else {
        alert("Acesso negado!");
    }
}

// Função para logout de admin
function adminLogout() {
    localStorage.removeItem("adminAuth");
    window.location.href = "login.html";
}

// Verifica autenticação do admin
if (window.location.pathname.includes("admin.html") && localStorage.getItem("adminAuth") !== "true") {
    window.location.href = "login.html";
}

// Criar conta de usuário
function createUser() {
    const username = document.getElementById("new-user").value;
    const password = document.getElementById("new-pass").value;
    const validity = parseInt(document.getElementById("validity").value);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + validity);
    
    users.push({ username, password, expiry: expiryDate.getTime() });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Usuário criado com sucesso!");
}

// Login de usuário
function userLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        if (new Date().getTime() < user.expiry) {
            localStorage.setItem("userAuth", JSON.stringify({ loggedIn: true, user: username }));
            window.location.href = "index.html";
        } else {
            alert("Conta expirada!");
        }
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Logout de usuário
function userLogout() {
    localStorage.removeItem("userAuth");
    window.location.href = "login.html";
}

// Bloquear acesso sem login válido na index.html
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("index.html") && localStorage.getItem("userAuth") !== "true") {
        window.location.href = "login.html";
    }
});
