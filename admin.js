const repoOwner = "ardanraven"; // Substitua pelo seu nome de usuário no GitHub
const repoName = "Biblioteca-Oculta"; // Substitua pelo nome do seu repositório
const filePath = "accounts.json"; // Caminho do arquivo no repositório
const githubToken = "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"; // Substitua pelo seu token do GitHub
const adminPassword = "judas989"; // Senha do admin

// Login do Admin
function loginAdmin() {
    const inputPassword = document.getElementById("admin-password").value;
    if (inputPassword === adminPassword) {
        document.getElementById("admin-login-section").style.display = "none";
        document.getElementById("admin-panel-section").style.display = "block";
    } else {
        document.getElementById("admin-error-message").innerText = "Senha incorreta!";
    }
}

// Obter Contas
async function getAccounts() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    try {
        const response = await fetch(url, {
            headers: {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: "application/vnd.github.v3+json"
                }
                
            }
        });

        if (!response.ok) throw new Error(`Erro ao buscar contas: ${response.status}`);
        const data = await response.json();
        const content = atob(data.content);
        console.log("Contas obtidas:", JSON.parse(content));
        return JSON.parse(content); // Retorna o conteúdo JSON
    } catch (error) {
        console.error("Erro ao obter contas:", error);
        return [];
    }
}

// Atualizar Contas
async function updateAccounts(accounts) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    try {
        console.log("Buscando o SHA do arquivo...");
        const response = await fetch(url, {
            headers: {
                headers: {
                    Authorization: `token ${githubToken}`,
                    Accept: "application/vnd.github.v3+json"
                }
                
            }
        });

        if (!response.ok) throw new Error(`Erro ao buscar SHA do arquivo: ${response.status} - ${response.statusText}`);

        const data = await response.json();
        console.log("SHA do arquivo encontrado:", data.sha);

        const updatedContent = btoa(JSON.stringify(accounts, null, 2));
        console.log("Conteúdo atualizado (Base64):", updatedContent);

        const updateResponse = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Atualizando contas",
                content: updatedContent,
                sha: data.sha
            })
        });

        if (!updateResponse.ok) throw new Error(`Erro ao atualizar contas: ${updateResponse.status} - ${updateResponse.statusText}`);
        console.log("Contas atualizadas com sucesso no GitHub!");
    } catch (error) {
        console.error("Erro ao atualizar contas:", error);
    }
}


// Criar Conta
async function createAccount() {
    const username = document.getElementById("username").value;
    const validity = parseInt(document.getElementById("validity").value);

    if (!username) {
        alert("Por favor, insira um nome de usuário.");
        return;
    }

    const password = generatePassword();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + validity);

    const newAccount = {
        username: username,
        password: password,
        expiration: expirationDate.toISOString()
    };

    try {
        const accounts = await getAccounts();
        accounts.push(newAccount);
        await updateAccounts(accounts);

        document.getElementById("generated-password").innerText = `Conta criada com sucesso!\nUsuário: ${username}\nSenha: ${password}`;
        updateAccountList();
    } catch (error) {
        console.error("Erro ao criar conta:", error);
    }
}

// Gerar Senha
function generatePassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Atualizar Lista de Contas
async function updateAccountList() {
    const accountList = document.getElementById("active-accounts");
    accountList.innerHTML = "";

    try {
        const accounts = await getAccounts();
        const now = new Date();

        accounts.forEach(account => {
            const expirationDate = new Date(account.expiration);
            if (expirationDate > now) {
                const listItem = document.createElement("div");
                listItem.classList.add("account-item");
                listItem.innerHTML = `
                    <p>Usuário: ${account.username}</p>
                    <p>Expira em: ${expirationDate.toLocaleDateString()}</p>
                `;
                accountList.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar lista de contas:", error);
    }
}

// Atualiza a lista ao carregar a página
updateAccountList();
