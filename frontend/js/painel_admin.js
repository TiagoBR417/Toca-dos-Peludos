
// VERIFICAÇÃO DE SEGURANÇA (JWT)

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado || usuarioLogado.tipo !== 'admin' || !usuarioLogado.token) {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("login.html");
  throw new Error("Acesso negado. Parando a execução da página.");
}

const TOKEN = usuarioLogado.token;


// CONFIGURAÇÕES GERAIS

const ADMIN_ENDPOINTS = {
  pets: `${BASE_URL}/admin/pets.php`,
  eventos: `${BASE_URL}/admin/eventos.php`,
  denuncias: `${BASE_URL}/admin/denuncias.php`,
  inscricoes: `${BASE_URL}/admin/inscricoes.php`,
  agendamentos: `${BASE_URL}/admin/agendamentos.php`
};

let dadosTabelaAtual = [];

document.addEventListener("DOMContentLoaded", () => {
  // Atualiza o nome do admin no cabeçalho
  const nomeAdminSpan = document.querySelector(".nav-content span");
  if (nomeAdminSpan && usuarioLogado.nome) {
      nomeAdminSpan.innerHTML = `Olá, <strong>${usuarioLogado.nome}</strong>!`;
  }

  carregarResumoDashboard();
  carregarSecao(); 

// Eventos de clique nos cards do topo
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function() {
    
      document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      
      // 2. Lê o texto visível dentro do card (converte para minúsculas para evitar erros)
      const textoVisivel = this.textContent.toLowerCase();

      // 3. Procura a palavra-chave no texto e carrega a tabela certa
      if (textoVisivel.includes("evento")) {
        carregarSecao('eventos');
      } else if (textoVisivel.includes("denúncia") || textoVisivel.includes("denuncia")) {
        carregarSecao('denuncias');
      } else if (textoVisivel.includes("inscriç") || textoVisivel.includes("inscric")) {
        carregarSecao('inscricoes');
      } else if (textoVisivel.includes("agendamento")) {
        carregarSecao('agendamentos');
      } else {
        carregarSecao('pets');
      }
    });
  });
});

// Função para deslogar
function fazerLogout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

// 3. CARREGAMENTO DE DADOS (GET COM TOKEN)

async function carregarResumoDashboard() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard.php`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });

    // Se o token for inválido, desloga
    if (response.status === 401 || response.status === 403) {
      fazerLogout();
      return;
    }

    const resultado = await response.json();
    if (resultado.success) {
      const d = resultado.data;
      document.getElementById("totalPets").textContent = d.total_pets || 0;
      document.getElementById("totalEventos").textContent = d.total_eventos || 0;
      document.getElementById("totalDenuncias").textContent = d.total_denuncias || 0;
      document.getElementById("totalInscricoes").textContent = d.total_inscricoes || 0;
      document.getElementById("totalAgendamentos").textContent = d.total_agendamentos || 0;
    }
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

async function carregarSecao(secao) {
  const container = document.getElementById("adminTabela");
  const mensagem = document.getElementById("adminMensagem");
  const tabelaAntiga = container.querySelector('.admin-table-wrapper');

  if (tabelaAntiga) {
    tabelaAntiga.classList.add('fadeOut');
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  container.innerHTML = '<div class="loader-suave">Buscando dados...</div>';
  mensagem.textContent = "";
  mensagem.className = "admin-mensagem";

  const endpoint = ADMIN_ENDPOINTS[secao];

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });

    if (response.status === 401 || response.status === 403) {
      fazerLogout();
      return;
    }

    const resultado = await response.json();

    if (resultado.success && resultado.data.length > 0) {
      dadosTabelaAtual = resultado.data;
      renderizarTabela(secao, resultado.data);
    } else {
      dadosTabelaAtual = [];
      container.innerHTML = `<div class="admin-vazio">Nenhum registo encontrado para ${secao}.</div>`;
    }
  } catch (error) {
    mensagem.textContent = "Erro ao carregar dados. Verifique a conexão.";
    mensagem.classList.add("erro");
    container.innerHTML = "";
  }
}

function renderizarTabela(secao, dados) {
  const container = document.getElementById("adminTabela");
  
  if (!dados || dados.length === 0) return;

  const colunas = Object.keys(dados[0]);
  
  let html = `<div class="admin-table-wrapper"><table class="admin-table"><thead><tr>`;
  
  colunas.forEach(col => {
    let nomeFormatado = col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    html += `<th>${nomeFormatado}</th>`;
  });
  html += `<th>Ações</th></tr></thead><tbody>`;

  dados.forEach(item => {
    html += `<tr>`;
    colunas.forEach(col => {
      let valor = item[col] || '-';
      if(col.includes('data')) {
          valor = new Date(valor).toLocaleDateString('pt-BR');
      }
      html += `<td>${valor}</td>`;
    });

    if (secao === 'pets') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px;" onclick="abrirModalPet(${item.id})">Detalhes</button></td>`;
    } else if (secao === 'agendamentos') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #2196F3;" onclick="abrirModalAgendamento(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'inscricoes') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #4CAF50;" onclick="abrirModalInscricao(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'denuncias') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #e74c3c;" onclick="abrirModalDenuncia(${item.id})">Ver Caso</button></td>`;
    } else if (secao === 'eventos') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #9C27B0;" onclick="abrirModalEvento(${item.id})">Gerenciar</button></td>`;
    } else {
      html += `<td>-</td>`;
    }
    
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// 4. MODAIS E ATUALIZAÇÕES (POST COM TOKEN)

//  PETS 
function abrirModalPet(idPet) {
  const pet = dadosTabelaAtual.find(p => Number(p.id) === Number(idPet));
  if (pet) {
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
document.getElementById("formEditarPet")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    id: document.getElementById("editPetId").value,
    nome: document.getElementById("editPetNome").value,
    status: document.getElementById("editPetStatus").value,
    descricao: document.getElementById("editPetDescricao").value
  };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_pet.php`, payload, "msgEditPet", fecharModalPet, "pets");
});

// AGENDAMENTOS
function abrirModalAgendamento(id) {
  const item = dadosTabelaAtual.find(a => Number(a.id) === Number(id));
  if(item) {
    document.getElementById("editAgendId").value = item.id;
    document.getElementById("infoAgendNome").textContent = item.nome_interessado;
    document.getElementById("infoAgendPet").textContent = item.nome_pet || "Pet não encontrado";
    const dataFormatada = new Date(item.data_visita).toLocaleDateString('pt-BR');
    document.getElementById("infoAgendData").textContent = `${dataFormatada} às ${item.horario_visita}`;
    document.getElementById("editAgendStatus").value = item.status;
    document.getElementById("modalAgendamento").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalAgendamento() {
  document.getElementById("modalAgendamento").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditAgendamento").textContent = "";
}
document.getElementById("formEditarAgendamento")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { id: document.getElementById("editAgendId").value, status: document.getElementById("editAgendStatus").value };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_agendamento.php`, payload, "msgEditAgendamento", fecharModalAgendamento, "agendamentos");
});

// INSCRIÇÕES
function abrirModalInscricao(id) {
  const item = dadosTabelaAtual.find(i => Number(i.id) === Number(id));
  if(item) {
    document.getElementById("editInscId").value = item.id;
    document.getElementById("inscEvento").textContent = item.evento;
    document.getElementById("inscNome").textContent = item.nome;
    document.getElementById("editInscStatus").value = item.status;
    document.getElementById("modalInscricao").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalInscricao() {
  document.getElementById("modalInscricao").style.display = "none";
  document.body.classList.remove("no-scroll");
}
document.getElementById("formEditarInscricao")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { id: document.getElementById("editInscId").value, status: document.getElementById("editInscStatus").value };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_inscricao.php`, payload, "msgEditInsc", fecharModalInscricao, "inscricoes");
});

// DENÚNCIAS
function abrirModalDenuncia(id) {
  const item = dadosTabelaAtual.find(i => Number(i.id) === Number(id));
  if(item) {
    document.getElementById("editDenId").value = item.id;
    document.getElementById("denTipo").textContent = item.tipo;
    document.getElementById("denLocal").textContent = item.localizacao;
    document.getElementById("denRelato").textContent = item.descricao;
    document.getElementById("editDenStatus").value = item.status;
    document.getElementById("modalDenuncia").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalDenuncia() {
  document.getElementById("modalDenuncia").style.display = "none";
  document.body.classList.remove("no-scroll");
}
document.getElementById("formEditarDenuncia")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { id: document.getElementById("editDenId").value, status: document.getElementById("editDenStatus").value };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_denuncia.php`, payload, "msgEditDen", fecharModalDenuncia, "denuncias");
});

// EVENTOS
function abrirModalEvento(id) {
  const item = dadosTabelaAtual.find(e => Number(e.id) === Number(id));
  if(item) {
    document.getElementById("editEventoId").value = item.id;
    document.getElementById("infoEventoTitulo").textContent = item.titulo;
    const dataObj = new Date(item.data_evento);
    const dataFormatada = `${String(dataObj.getUTCDate()).padStart(2, '0')}/${String(dataObj.getUTCMonth() + 1).padStart(2, '0')}/${dataObj.getUTCFullYear()}`;
    document.getElementById("infoEventoData").textContent = dataFormatada;
    document.getElementById("infoEventoLocal").textContent = `${item.local} (${item.cidade})`;
    document.getElementById("editEventoStatus").value = item.status;
    document.getElementById("modalEvento").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalEvento() {
  document.getElementById("modalEvento").style.display = "none";
  document.body.classList.remove("no-scroll");
}
document.getElementById("formEditarEvento")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { id: document.getElementById("editEventoId").value, status: document.getElementById("editEventoStatus").value };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_evento.php`, payload, "msgEditEvento", fecharModalEvento, "eventos");
});

// 5. FUNÇÃO AUXILIAR PARA ENVIAR POST COM TOKEN

async function enviarAtualizacao(url, payload, idMensagem, funcFecharModal, nomeSecao) {
  const msg = document.getElementById(idMensagem);
  msg.textContent = "Atualizando...";
  msg.className = "admin-mensagem";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}` 
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 401 || response.status === 403) {
      fazerLogout(); return;
    }

    const resultado = await response.json();

    if (resultado.success) {
      msg.textContent = "Sucesso!";
      msg.classList.add("sucesso");
      msg.style.color = "green";
      
      setTimeout(() => {
        funcFecharModal();
        carregarSecao(nomeSecao);
        carregarResumoDashboard(); 
      }, 1000);
    } else {
      msg.textContent = resultado.message;
      msg.classList.add("erro");
    }
  } catch (error) {
    msg.textContent = "Erro de conexão.";
    msg.classList.add("erro");
  }
}