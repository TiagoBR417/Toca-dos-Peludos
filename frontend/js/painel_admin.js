document.addEventListener("DOMContentLoaded", () => {
  const menuSanduiche = document.querySelector(".menu-sanduiche");
  const navLinks = document.querySelector(".links");

  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener("click", () => {
      navLinks.classList.toggle("ativo");
    });
  }

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  if (!usuario) {
    alert("Você precisa estar logado para acessar o painel.");
    window.location.href = "login.html";
    return;
  }

  if (usuario.tipo !== "admin") {
    alert("Acesso restrito ao administrador.");
    window.location.href = "index.html";
    return;
  }

  configurarTabs();
  carregarSecao("pets");
  carregarResumoDashboard();
});

const ADMIN_ENDPOINTS = {
  pets: `${BASE_URL}/admin/pets.php`,
  eventos: `${BASE_URL}/admin/eventos.php`,
  denuncias: `${BASE_URL}/admin/denuncias.php`,
  agendamentos: `${BASE_URL}/admin/agendamentos.php`,
  inscricoes: `${BASE_URL}/admin/inscricoes.php`
};

function configurarTabs() {
  const tabs = document.querySelectorAll(".admin-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const secao = tab.dataset.section;
      carregarSecao(secao);
    });
  });
}

async function carregarSecao(secao) {
  const container = document.getElementById("adminTabela");
  const mensagem = document.getElementById("adminMensagem");

  container.innerHTML = "";
  mensagem.textContent = "";
  mensagem.className = "admin-mensagem";

  const endpoint = ADMIN_ENDPOINTS[secao];

  if (!endpoint) {
    mensagem.textContent = "Seção inválida.";
    mensagem.classList.add("erro");
    return;
  }

  try {
    const response = await fetch(endpoint);
    const resultado = await response.json();

    if (!resultado.success) {
      mensagem.textContent = resultado.message || "Erro ao carregar dados.";
      mensagem.classList.add("erro");
      return;
    }

    renderizarTabela(secao, resultado.data);
  } catch (error) {
    console.error(`Erro ao carregar ${secao}:`, error);
    mensagem.textContent = "Erro ao carregar dados do painel.";
    mensagem.classList.add("erro");
  }
}

// Variável global para guardar os dados da tabela atual e facilitar o modal
let dadosTabelaAtual = [];
let secaoAtual = "";

function renderizarTabela(secao, dados) {
  const container = document.getElementById("adminTabela");
  dadosTabelaAtual = dados; // Salva os dados para o modal usar
  secaoAtual = secao;

  if (!dados || !dados.length) {
    container.innerHTML = `<p class="admin-vazio">Nenhum registro encontrado em ${secao}.</p>`;
    return;
  }

  const colunas = Object.keys(dados[0]);

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
  `;

  colunas.forEach((coluna) => {
    html += `<th>${formatarTitulo(coluna)}</th>`;
  });
  
  // Adiciona a coluna de Ações
  html += `<th>Ações</th></tr></thead><tbody>`;

  dados.forEach((item) => {
    html += `<tr>`;
    colunas.forEach((coluna) => {
      const valor = item[coluna] ?? "";
      html += `<td>${escapeHtml(String(valor))}</td>`;
    });

    // Adiciona o botão de detalhes que chama o Modal passando o ID do item
    if(secao === 'pets') {
        html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px;" onclick="abrirModalPet(${item.id})">Detalhes</button></td>`;
    } else {
        html += `<td>-</td>`; // Para as outras abas, deixamos um traço por enquanto
    }

    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// --- FUNÇÕES DO MODAL ---
function abrirModalPet(idPet) {
  // Procura o pet nos dados que já baixamos do banco
  const pet = dadosTabelaAtual.find(p => Number(p.id) === Number(idPet));
  
  if(pet) {
    document.getElementById("editPetId").value = pet.id;
    document.getElementById("editPetNome").value = pet.nome;
    document.getElementById("editPetStatus").value = pet.status;
    document.getElementById("editPetDescricao").value = pet.descricao || "";
    
    document.getElementById("modalPet").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}

function fecharModalPet() {
  document.getElementById("modalPet").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditPet").textContent = "";
}

// Interceptar o envio do formulário de edição
document.getElementById("formEditarPet")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const msg = document.getElementById("msgEditPet");
  msg.textContent = "Salvando...";
  msg.className = "admin-mensagem";

  const payload = {
    id: document.getElementById("editPetId").value,
    nome: document.getElementById("editPetNome").value,
    status: document.getElementById("editPetStatus").value,
    descricao: document.getElementById("editPetDescricao").value
  };

  try {
    // Vamos criar esse arquivo PHP no próximo passo!
    const response = await fetch(`${BASE_URL}/admin/atualizar_pet.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resultado = await response.json();

    if (resultado.success) {
      msg.textContent = "Pet atualizado com sucesso!";
      msg.classList.add("sucesso");
      msg.style.color = "green";
      
      // Recarrega a tabela para mostrar os dados novos
      setTimeout(() => {
        fecharModalPet();
        carregarSecao("pets"); 
      }, 1000);
    } else {
      msg.textContent = resultado.message;
      msg.classList.add("erro");
    }
  } catch (error) {
    msg.textContent = "Erro ao conectar com o servidor.";
    msg.classList.add("erro");
  }
});

function formatarTitulo(texto) {
  return texto
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

//carregar dashboard para carregar quantidade de itens do bd
async function carregarResumoDashboard() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard.php`);
    const resultado = await response.json();

    if (resultado.success) {
      const totais = resultado.data;
      
      // Busca o card pela data-section e atualiza o span.numero dentro dele
      document.querySelector('.card[data-section="pets"] .numero').textContent = totais.total_pets;
      document.querySelector('.card[data-section="eventos"] .numero').textContent = totais.total_eventos;
      document.querySelector('.card[data-section="denuncias"] .numero').textContent = totais.total_denuncias;
      document.querySelector('.card[data-section="inscricoes"] .numero').textContent = totais.total_inscricoes;
      document.querySelector('.card[data-section="agendamentos"] .numero').textContent = totais.total_agendamentos;
    }
  } catch (error) {
    console.error("Erro ao carregar o resumo do dashboard:", error);
  }
}
  