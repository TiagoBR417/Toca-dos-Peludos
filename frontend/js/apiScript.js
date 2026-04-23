const BASE_URL = "http://localhost/Toca-dos-Peludos/api";

const API_PETS_URL = `${BASE_URL}/site/pets.php`;
const API_EVENTOS_URL = `${BASE_URL}/site/eventos.php`;
const API_INSCRICOES_URL = `${BASE_URL}/site/inscricoes.php`;
const API_AGENDAMENTOS_URL = `${BASE_URL}/site/agendamentos.php`;
const API_DENUNCIAS_URL = `${BASE_URL}/site/denuncias.php`;
const API_CADASTRO_URL = `${BASE_URL}/site/cadastro.php`;
const API_LOGIN_URL = `${BASE_URL}/site/login.php`;

// Aguarda o HTML carregar para mexer no menu
document.addEventListener("DOMContentLoaded", () => {
    atualizarMenuNavegacao();
});

function atualizarMenuNavegacao() {
    const areaAuth = document.getElementById("areaAuth");
    
    // Se a página não tiver essa área, o script para silenciosamente
    if (!areaAuth) return; 

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado && usuarioLogado.token) {
        // Pega apenas o primeiro nome
        const primeiroNome = usuarioLogado.nome ? usuarioLogado.nome.split(' ')[0] : 'Usuário';

        // Se for o Tiago (Admin)
        if (usuarioLogado.tipo === 'admin') {
            areaAuth.innerHTML = `
                <span style="margin-right: 15px; font-weight: 500;">Olá, <strong>${primeiroNome}</strong>!</span>
                <a href="painel_admin.html"><button class="btn-accent" style= border: none;">Painel Admin</button></a>
                <button class="btn-accent" onclick="fazerLogoutPublico()" style="background-color: #e74c3c; border: none;">Sair</button>
            `;
        } 
        // Se for um adotante normal (João Silva)
        else {
            areaAuth.innerHTML = `
                <span style="margin-right: 15px; font-weight: 500;">Olá, <strong>${primeiroNome}</strong>!</span>
                <a href="perfil.html"><button class="btn-accent" style= border: none;">Meu Perfil</button></a>
                <a href="index.html#ajude"><button class="btn-accent" style= border: none;">Doar</button></a>
                <button class="btn-accent" onclick="fazerLogoutPublico()" style="background-color: #e74c3c; border: none;">Sair</button>
            `;
        }
    } else {
        // Se for um visitante sem login, mostra o Entrar e o Doar originais
        areaAuth.innerHTML = `
            <a href="login.html"><button class="btn-accent">Entrar</button></a>
            <a href="index.html#ajude"><button class="btn-accent">Doar</button></a>
        `;
    }
}

// Função global para deslogar a partir do site público
window.fazerLogoutPublico = function() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html"; // Recarrega a página inicial
};