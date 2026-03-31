const BASE_URL = "http://localhost/Toca-dos-Peludos/api";

const API_PETS_URL = `${BASE_URL}/pets.php`;
const API_EVENTOS_URL = `${BASE_URL}/eventos.php`;
const API_INSCRICOES_URL = `${BASE_URL}/inscricoes.php`;
const API_AGENDAMENTOS_URL = `${BASE_URL}/agendamentos.php`;

document.addEventListener("DOMContentLoaded", () => {
  verificarSessao();
});

function verificarSessao() {
  const usuarioString = localStorage.getItem("usuarioLogado");
  const areaAcoes = document.querySelector(".actions");

  if (usuarioString && areaAcoes) {
    const usuario = JSON.parse(usuarioString);
    areaAcoes.innerHTML = `
      <span style="margin-right: 15px; font-weight: 600; color: #333;">Olá, ${usuario.nome}!</span>
      <button onclick="fazerLogout()" class="btn-accent" style="background-color: #e74c3c; border: none;">Sair</button>
    `;
  }
}

window.fazerLogout = function () {
  localStorage.removeItem("usuarioLogado");
  window.location.reload();
};