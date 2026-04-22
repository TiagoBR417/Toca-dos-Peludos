const BASE_URL = "http://localhost/Toca-dos-Peludos/api";

const API_PETS_URL = `${BASE_URL}/site/pets.php`;
const API_EVENTOS_URL = `${BASE_URL}/site/eventos.php`;
const API_INSCRICOES_URL = `${BASE_URL}/site/inscricoes.php`;
const API_AGENDAMENTOS_URL = `${BASE_URL}/site/agendamentos.php`;
const API_DENUNCIAS_URL = `${BASE_URL}/site/denuncias.php`;
const API_CADASTRO_URL = `${BASE_URL}/site/cadastro.php`;
const API_LOGIN_URL = `${BASE_URL}/site/login.php`;

document.addEventListener("DOMContentLoaded", () => {
  verificarSessao();
});

function verificarSessao() {
  const usuarioString = localStorage.getItem("usuarioLogado");
  const areaAcoes = document.querySelector(".actions");

  if (usuarioString && areaAcoes) {
    const usuario = JSON.parse(usuarioString);

    areaAcoes.innerHTML = `
      <span style="margin-right: 15px; font-weight: 600; color: #333;">
        Olá, ${usuario.nome}!
      </span>

      ${
        usuario.tipo === "admin"
          ? `<a href="painel_admin.html">
               <button class="btn-accent">Painel Admin</button>
             </a>`
          : ""
      }

      <button onclick="fazerLogout()" class="btn-accent" style="background-color: #e74c3c; border: none;">
        Sair
      </button>
    `;
  }
}
window.fazerLogout = function () {
  localStorage.removeItem("usuarioLogado");
  window.location.reload();
};