// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAVUXzVk-cZUrm3xxKz8HuK7KGmXf3CNxU",
    authDomain: "biblioteca-oculta-ca5c6.firebaseapp.com",
    projectId: "biblioteca-oculta-ca5c6",
    storageBucket: "biblioteca-oculta-ca5c6.firebasestorage.app",
    messagingSenderId: "287494503696",
    appId: "1:287494503696:web:14b91e4374e781c0ae7995"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Criar conta de usuário com validade
function createUser() {
    const username = document.getElementById("new-user").value;
    const password = document.getElementById("new-pass").value;
    const validity = parseInt(document.getElementById("validity").value);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + validity);

    auth.createUserWithEmailAndPassword(username + "@biblioteca.com", password)
        .then(userCredential => {
            db.collection("users").doc(userCredential.user.uid).set({
                username: username,
                expiry: expiryDate.getTime()
            });
            alert("Usuário criado com sucesso!");
        })
        .catch(error => {
            alert("Erro ao criar usuário: " + error.message);
        });
}

// Login de usuário
function userLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(username + "@biblioteca.com", password)
        .then(userCredential => {
            db.collection("users").doc(userCredential.user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        if (new Date().getTime() < userData.expiry) {
                            localStorage.setItem("userAuth", JSON.stringify({ loggedIn: true, user: username }));
                            window.location.href = "index.html";
                        } else {
                            alert("Conta expirada!");
                            auth.signOut();
                        }
                    }
                });
        })
        .catch(error => {
            alert("Usuário ou senha incorretos!");
        });
}

// Logout
function userLogout() {
    auth.signOut().then(() => {
        localStorage.removeItem("userAuth");
        window.location.href = "login.html";
    });
}

// Verificar login persistente
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (new Date().getTime() < userData.expiry) {
                    localStorage.setItem("userAuth", JSON.stringify({ loggedIn: true, user: userData.username }));
                } else {
                    auth.signOut();
                }
            }
        });
    }
});
