// 1. Puxa o usuário logado com o nome que o resto do código espera
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

// 2. Verifica se existe, se é admin e se tem token
if (!usuarioLogado || usuarioLogado.tipo !== "admin" || !usuarioLogado.token) {
  alert("Acesso restrito ao administrador. Faça login.");
  window.location.replace("login.html");
  throw new Error("Parando a execução da página. Acesso negado.");
}

// 3. Salva o token para a API poder carregar as tabelas
const TOKEN = usuarioLogado.token;

const ADMIN_ENDPOINTS = {
  pets: `${BASE_URL}/admin/pets.php`,
  eventos: `${BASE_URL}/admin/eventos.php`,
  denuncias: `${BASE_URL}/admin/denuncias.php`,
  inscricoes: `${BASE_URL}/admin/inscricoes.php`,
  agendamentos: `${BASE_URL}/admin/agendamentos.php`,
  usuarios: `${BASE_URL}/admin/usuarios.php`
};

let dadosTabelaAtual = [];

document.addEventListener("DOMContentLoaded", () => {
  const nomeAdminSpan = document.querySelector(".nav-content span");
  if (nomeAdminSpan && usuarioLogado.nome) {
      nomeAdminSpan.innerHTML = `Olá, <strong>${usuarioLogado.nome}</strong>!`;
  }

  carregarResumoDashboard();
  carregarSecao('pets');

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function() {
      document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      
      const textoVisivel = this.textContent.toLowerCase();

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

function fazerLogout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

async function carregarResumoDashboard() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard.php`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });

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
      let htmlVazio = '';
      if (secao === 'eventos') {
         htmlVazio = `<div style="margin-bottom: 15px; text-align: right;">
                        <button class="btn-accent" style="background-color: #4CAF50; padding: 10px 20px;" onclick="abrirModalCriarEvento()">+ Novo Evento</button>
                      </div>`;
      }
      container.innerHTML = htmlVazio + `<div class="admin-vazio">Nenhum registo encontrado para ${secao}.</div>`;
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
  let html = '';
  
  if (secao === 'eventos') {
      html += `<div style="margin-bottom: 15px; text-align: right;">
                 <button class="btn-accent" style="background-color: #4CAF50; padding: 10px 20px;" onclick="abrirModalCriarEvento()">+ Novo Evento</button>
               </div>`;
  }

  html += `<div class="admin-table-wrapper"><table class="admin-table"><thead><tr>`;
  
  colunas.forEach(col => {
    let nomeFormatado = col.replace(/_/g, ' ').replace(/\w/g, l => l.toUpperCase());
    html += `<th>${nomeFormatado}</th>`;
  });
  html += `<th>Ações</th></tr></thead><tbody>`;

  dados.forEach(item => {
    html += `<tr>`;
    colunas.forEach(col => {
      let valor = item[col] || '-';
      if(col.includes('data') || col.includes('created_at')) {
          valor = new Date(valor).toLocaleDateString('pt-BR');
      }
      html += `<td>${valor}</td>`;
    });

    if (secao === 'pets') {
      html += `<td>
                <button class="btn-accent-editar" onclick="abrirModalPet(${item.id})">Editar</button>
                <button class="btn-accent-excluir" onclick="excluirPet(${item.id})">Excluir</button>
              </td>`;
    } else if (secao === 'eventos') {
      html += `<td>
                <button class="btn-accent-editar" onclick="abrirModalEvento(${item.id})">Gerenciar</button>
                <button class="btn-accent-excluir" onclick="excluirEvento(${item.id})">Excluir</button>
               </td>`;
    } else if (secao === 'agendamentos') {
      html += `<td>
                <button class="btn-accent-editar" onclick="abrirModalAgendamento(${item.id})">Gerenciar</button>
                <button class="btn-accent-excluir" onclick="excluirAgendamento(${item.id})">Excluir</button>
               </td>`;
    } else if (secao === 'inscricoes') {
      html += `<td><button class="btn-accent-editar" onclick="abrirModalInscricao(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'denuncias') {
      html += `<td><button class="btn-accent-editar" onclick="abrirModalDenuncia(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'usuarios') {
      html += `<td>
                <button class="btn-accent-editar" style="background-color: #f39c12;" onclick="abrirModalUsuario(${item.id})">Gerenciar</button>
                <button class="btn-accent-excluir" onclick="excluirUsuario(${item.id})">Excluir</button>
               </td>`;
    } else {
      html += `<td>-</td>`;
    }
    
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// 4. MODAIS E ATUALIZAÇÕES (POST COM TOKEN)

// PETS 
function abrirModalPet(idPet) {
  const pet = dadosTabelaAtual.find(p => Number(p.id) === Number(idPet));
  if (pet) {
    document.getElementById("editPetId").value = pet.id;
    document.getElementById("editPetNome").value = pet.nome;
    document.getElementById("editPetPorte").value = pet.porte || "pequeno";
    document.getElementById("editPetCor").value = pet.cor || "";
    document.getElementById("editPetIdade").value = pet.idade || "";
    document.getElementById("editPetCidade").value = pet.cidade || "";
    document.getElementById("editPetBairro").value = pet.bairro || "";
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
    porte: document.getElementById("editPetPorte").value,
    cor: document.getElementById("editPetCor").value,
    idade: document.getElementById("editPetIdade").value,
    cidade: document.getElementById("editPetCidade").value,
    bairro: document.getElementById("editPetBairro").value,
    status: document.getElementById("editPetStatus").value,
    descricao: document.getElementById("editPetDescricao").value
  };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_pet.php`, payload, "msgEditPet", fecharModalPet, "pets");
});

document.getElementById("formCriarPet")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    nome: document.getElementById("novoPetNome").value,
    tipo: document.getElementById("novoPetTipo").value,
    porte: document.getElementById("novoPetPorte").value,
    cor: document.getElementById("novoPetCor").value,
    idade: document.getElementById("novoPetIdade").value,
    cidade: document.getElementById("novoPetCidade").value,
    bairro: document.getElementById("novoPetBairro").value,
    status: document.getElementById("novoPetStatus").value,
    descricao: document.getElementById("novoPetDescricao").value
  };
  await enviarAtualizacao(`${BASE_URL}/admin/criar_pet.php`, payload, "msgCriarPet", fecharModalCriarPet, "pets");
});

function abrirModalCriarPet() {
  document.getElementById("formCriarPet").reset();
  document.getElementById("msgCriarPet").textContent = "";
  document.getElementById("modalCriarPet").style.display = "block";
  document.body.classList.add("no-scroll");
}

function fecharModalCriarPet() {
  document.getElementById("modalCriarPet").style.display = "none";
  document.body.classList.remove("no-scroll");
}

async function excluirPet(id) {
  if (!confirm("Tem certeza que deseja remover este pet permanentemente?")) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/excluir_pet.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` },
      body: JSON.stringify({ id: id })
    });

    if (response.status === 401 || response.status === 403) { fazerLogout(); return; }
    
    const resultado = await response.json();
    if (resultado.success) {
      carregarDadosTabelaDashboard('pets', 'container-tabela-pets');
      carregarResumoDashboard();
    } else {
      alert(resultado.message);
    }
  } catch (error) {
    alert("Erro de conexão ao tentar excluir o pet.");
  }
}

// AGENDAMENTOS
function abrirModalAgendamento(id) {
  const item = dadosTabelaAtual.find(a => Number(a.id) === Number(id));
  if(item) {
    document.getElementById("editAgendId").value = item.id;
    document.getElementById("infoAgendPet").textContent = item.nome_pet || "Pet não encontrado";
    
    document.getElementById("editAgendNome").value = item.nome_interessado;
    document.getElementById("editAgendTelefone").value = item.telefone_interessado;
    
    const dataDB = item.data_visita;
    document.getElementById("editAgendData").value = dataDB ? dataDB.split(' ')[0] : '';
    
    const horarioDB = item.horario_visita;
    document.getElementById("editAgendHorario").value = horarioDB ? horarioDB.substring(0, 5) : '';

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
  const payload = { 
    id: document.getElementById("editAgendId").value,
    nome_interessado: document.getElementById("editAgendNome").value,
    telefone_interessado: document.getElementById("editAgendTelefone").value,
    data_visita: document.getElementById("editAgendData").value,
    horario_visita: document.getElementById("editAgendHorario").value,
    status: document.getElementById("editAgendStatus").value 
  };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_agendamento.php`, payload, "msgEditAgendamento", fecharModalAgendamento, "agendamentos");
});

async function excluirAgendamento(id) {
  if (!confirm("Tem certeza que deseja excluir permanentemente este agendamento?")) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/excluir_agendamento.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` },
      body: JSON.stringify({ id: id })
    });

    if (response.status === 401 || response.status === 403) { fazerLogout(); return; }
    
    const resultado = await response.json();
    if (resultado.success) {
      carregarDadosTabelaDashboard('agendamentos', 'container-tabela-agendamentos'); 
      carregarSecao('agendamentos');
      carregarResumoDashboard(); 
    } else {
      alert(resultado.message);
    }
  } catch (error) {
    alert("Erro de conexão ao tentar excluir.");
  }
}

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
    document.getElementById("editEventoTitulo").value = item.titulo;
    
    const dataDB = item.data_evento;
    document.getElementById("editEventoData").value = dataDB ? dataDB.split(' ')[0] : '';
    
    document.getElementById("editEventoLocal").value = item.local;
    document.getElementById("editEventoCidade").value = item.cidade;
    document.getElementById("editEventoStatus").value = item.status;
    
    document.getElementById("modalEvento").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalEvento() {
  document.getElementById("modalEvento").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditEvento").textContent = "";
}
document.getElementById("formEditarEvento")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { 
    id: document.getElementById("editEventoId").value, 
    titulo: document.getElementById("editEventoTitulo").value,
    data_evento: document.getElementById("editEventoData").value,
    local: document.getElementById("editEventoLocal").value,
    cidade: document.getElementById("editEventoCidade").value,
    status: document.getElementById("editEventoStatus").value 
  };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_evento.php`, payload, "msgEditEvento", fecharModalEvento, "eventos");
});

// 5. FUNÇÃO AUXILIAR PARA ENVIAR POST COM TOKEN
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
        
        // MÁGICA DO REFRESH: Identifica qual aba está aberta (Ex: Pets > Tabelas)
        // e "clica" nela para forçar o recarregamento dos dados na mesma hora
        const abaAtiva = document.querySelector('.submenu li.active');
        if (abaAtiva) {
            abaAtiva.click();
        }
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

// EVENTOS - CRIAR E EXCLUIR
function abrirModalCriarEvento() {
  document.getElementById("formCriarEvento").reset();
  document.getElementById("msgCriarEvento").textContent = "";
  document.getElementById("modalCriarEvento").style.display = "block";
  document.body.classList.add("no-scroll");
}

function fecharModalCriarEvento() {
  document.getElementById("modalCriarEvento").style.display = "none";
  document.body.classList.remove("no-scroll");
}

document.getElementById("formCriarEvento")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    titulo: document.getElementById("novoEventoTitulo").value,
    data_evento: document.getElementById("novoEventoData").value,
    local: document.getElementById("novoEventoLocal").value,
    cidade: document.getElementById("novoEventoCidade").value
  };
  await enviarAtualizacao(`${BASE_URL}/admin/criar_evento.php`, payload, "msgCriarEvento", fecharModalCriarEvento, "eventos");
});

async function excluirEvento(id) {
  if (!confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/excluir_evento.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` },
      body: JSON.stringify({ id: id })
    });

    if (response.status === 401 || response.status === 403) { fazerLogout(); return; }
    
    const resultado = await response.json();
    if (resultado.success) {
      carregarSecao('eventos');
      carregarResumoDashboard();
    } else {
      alert(resultado.message);
    }
  } catch (error) {
    alert("Erro de conexão ao tentar excluir.");
  }
}

// ==========================================
// SISTEMA DE TABELAS DINÂMICAS COM PAGINAÇÃO
// ==========================================

// VARIÁVEIS GLOBAIS PARA CONTROLAR FILTROS E PÁGINAS DA TABELA
let tabelaState = {
  dados: [],
  secao: '',
  pagina: 1,
  limite: 10,
  busca: ''
};

// FUNÇÃO PRINCIPAL DE CARREGAMENTO
async function carregarDadosTabelaDashboard(secao, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="loader-suave">Atualizando listagem...</div>';
  const endpoint = ADMIN_ENDPOINTS[secao];

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });

    if (response.status === 401 || response.status === 403) { fazerLogout(); return; }

    const resultado = await response.json();

    if (resultado.success && resultado.data.length > 0) {
      // Atualiza a variável global do escopo admin para modais lerem os dados corretos
      dadosTabelaAtual = resultado.data; 
      
      // Salva os dados no estado do filtro
      tabelaState.dados = resultado.data;
      tabelaState.secao = secao;
      tabelaState.pagina = 1;
      tabelaState.busca = '';
      
      // Constrói a barra de pesquisa e limite no HTML
      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div>
                <label style="color: #475569; font-weight: 600; font-size: 0.9rem;">Mostrar 
                    <select onchange="mudarLimiteTabela(this.value, 'tabelaDados_${secao}')" style="padding: 6px; border-radius: 6px; border: 1px solid #cbd5e1; outline: none; cursor: pointer; font-family: inherit;">
                        <option value="5" ${tabelaState.limite == 5 ? 'selected' : ''}>5</option>
                        <option value="10" ${tabelaState.limite == 10 ? 'selected' : ''}>10</option>
                        <option value="20" ${tabelaState.limite == 20 ? 'selected' : ''}>20</option>
                        <option value="50" ${tabelaState.limite == 50 ? 'selected' : ''}>50</option>
                    </select> linhas
                </label>
            </div>
            <div>
                <input type="text" placeholder="🔍 Pesquisar em tudo..." 
                       oninput="filtrarTabela(this.value, 'tabelaDados_${secao}')"
                       style="padding: 8px 15px; border-radius: 6px; border: 1px solid #cbd5e1; width: 250px; outline: none; font-family: inherit;">
            </div>
        </div>
        <div id="tabelaDados_${secao}"></div>
      `;

      // Renderiza a primeira página da tabela
      renderizarTabelaFiltrada(`tabelaDados_${secao}`);

    } else {
      container.innerHTML = `<div class="admin-vazio">Nenhum registro encontrado para a listagem.</div>`;
    }
  } catch (error) {
    container.innerHTML = `<div style="color: red; font-size: 0.9rem;">Erro ao carregar listagem de gerenciamento.</div>`;
  }
}

// ==========================================
// FUNÇÕES DE APOIO PARA A TABELA DINÂMICA
// ==========================================
window.mudarLimiteTabela = function(novoLimite, subContainerId) {
    tabelaState.limite = Number(novoLimite);
    tabelaState.pagina = 1; 
    renderizarTabelaFiltrada(subContainerId);
}

window.filtrarTabela = function(termo, subContainerId) {
    tabelaState.busca = termo;
    tabelaState.pagina = 1; 
    renderizarTabelaFiltrada(subContainerId);
}

window.mudarPaginaTabela = function(novaPagina, subContainerId) {
    tabelaState.pagina = novaPagina;
    renderizarTabelaFiltrada(subContainerId);
}

function renderizarTabelaFiltrada(subContainerId) {
    const subContainer = document.getElementById(subContainerId);
    if (!subContainer) return;

    // 1. Aplica a Busca
    let dadosFiltrados = tabelaState.dados.filter(item => {
        if (!tabelaState.busca) return true;
        // Varre todas as colunas do item procurando a palavra digitada
        return Object.values(item).some(val => 
            String(val).toLowerCase().includes(tabelaState.busca.toLowerCase())
        );
    });

    // 2. Calcula a Paginação
    const totalPaginas = Math.ceil(dadosFiltrados.length / tabelaState.limite) || 1;
    if (tabelaState.pagina > totalPaginas) tabelaState.pagina = totalPaginas;
    if (tabelaState.pagina < 1) tabelaState.pagina = 1;
    
    const inicio = (tabelaState.pagina - 1) * tabelaState.limite;
    const fim = inicio + tabelaState.limite;
    const dadosPaginados = dadosFiltrados.slice(inicio, fim);

    if (dadosPaginados.length === 0) {
        subContainer.innerHTML = `<div class="admin-vazio">Nenhum resultado encontrado para "${tabelaState.busca}".</div>`;
        return;
    }

    // 3. Monta o Cabeçalho da Tabela
    const colunas = Object.keys(dadosPaginados[0]);
    let html = `<div class="admin-table-wrapper"><table class="admin-table"><thead><tr>`;
    
    colunas.forEach(col => {
        let nomeFormatado = col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `<th>${nomeFormatado}</th>`;
    });
    html += `<th>Ações</th></tr></thead><tbody>`;

    const secao = tabelaState.secao;

    // 4. Monta as Linhas da Tabela
    dadosPaginados.forEach(item => {
        html += `<tr>`;
        colunas.forEach(col => {
            let valor = item[col] || '-';
            if(col.includes('data') || col.includes('created_at')) {
                valor = new Date(valor).toLocaleDateString('pt-BR');
            }
            html += `<td>${valor}</td>`;
        });

        // Aplica os botões correspondentes da seção
        if (secao === 'pets') {
          html += `<td>
                    <button class="btn-accent-editar" onclick="abrirModalPet(${item.id})">Editar</button>
                    <button class="btn-accent-excluir" onclick="excluirPet(${item.id})">Excluir</button>
                  </td>`;
        } else if (secao === 'eventos') {
          html += `<td>
                    <button class="btn-accent-editar" onclick="abrirModalEvento(${item.id})">Gerenciar</button>
                    <button class="btn-accent-excluir" onclick="excluirEvento(${item.id})">Excluir</button>
                   </td>`;
        } else if (secao === 'agendamentos') {
          html += `<td>
                    <button class="btn-accent-editar" onclick="abrirModalAgendamento(${item.id})">Gerenciar</button>
                    <button class="btn-accent-excluir" onclick="excluirAgendamento(${item.id})">Excluir</button>
                   </td>`;
        } else if (secao === 'inscricoes') {
          html += `<td><button class="btn-accent-editar" onclick="abrirModalInscricao(${item.id})">Gerenciar</button></td>`;
        } else if (secao === 'denuncias') {
          html += `<td><button class="btn-accent-editar" onclick="abrirModalDenuncia(${item.id})">Gerenciar</button></td>`;
        } else if (secao === 'usuarios') {
          html += `<td>
                    <button class="btn-accent-editar" style="background-color: #f39c12;" onclick="abrirModalUsuario(${item.id})">Gerenciar</button>
                    <button class="btn-accent-excluir" onclick="excluirUsuario(${item.id})">Excluir</button>
                   </td>`;
        } else {
          html += `<td>-</td>`;
        }
        
        html += `</tr>`;
    });

    html += `</tbody></table></div>`;

    // 5. Monta a Lógica de Paginação Avançada (com reticências)
    let paginacaoHtml = '';
    
    // Botão Anterior
    paginacaoHtml += `<button onclick="mudarPaginaTabela(${tabelaState.pagina - 1}, '${subContainerId}')" 
                    ${tabelaState.pagina === 1 ? 'disabled' : ''} 
                    style="padding: 6px 12px; cursor: ${tabelaState.pagina === 1 ? 'not-allowed' : 'pointer'}; border: 1px solid #cbd5e1; background: ${tabelaState.pagina === 1 ? '#f8fafc' : '#fff'}; border-radius: 6px; color: ${tabelaState.pagina === 1 ? '#94a3b8' : '#333'}; font-weight: 600; transition: 0.2s;">
                Anterior
            </button>`;

    // Função que calcula quais números devem aparecer
    function getPaginas(atual, total) {
        if (total <= 5) return Array.from({length: total}, (_, i) => i + 1);
        if (atual <= 3) return [1, 2, 3, 4, '...', total];
        if (atual >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', atual - 1, atual, atual + 1, '...', total];
    }

    const paginasVisiveis = getPaginas(tabelaState.pagina, totalPaginas);

    // Renderiza os botões numéricos e os pontinhos (...)
    paginasVisiveis.forEach(p => {
        if (p === '...') {
            paginacaoHtml += `<span style="padding: 6px 4px; color: #64748b; font-weight: bold;">...</span>`;
        } else {
            const isActive = p === tabelaState.pagina;
            const bg = isActive ? '#6a1b9a' : '#fff';
            const color = isActive ? '#fff' : '#333';
            const border = isActive ? '1px solid #6a1b9a' : '1px solid #cbd5e1';
            
            paginacaoHtml += `<button onclick="mudarPaginaTabela(${p}, '${subContainerId}')" 
                                style="padding: 6px 12px; cursor: pointer; border: ${border}; background: ${bg}; border-radius: 6px; color: ${color}; font-weight: 600; transition: 0.2s; box-shadow: ${isActive ? '0 2px 4px rgba(106, 27, 154, 0.2)' : 'none'};">
                                ${p}
                              </button>`;
        }
    });

    // Botão Próximo
    paginacaoHtml += `<button onclick="mudarPaginaTabela(${tabelaState.pagina + 1}, '${subContainerId}')" 
                    ${tabelaState.pagina === totalPaginas ? 'disabled' : ''} 
                    style="padding: 6px 12px; cursor: ${tabelaState.pagina === totalPaginas ? 'not-allowed' : 'pointer'}; border: 1px solid #cbd5e1; background: ${tabelaState.pagina === totalPaginas ? '#f8fafc' : '#fff'}; border-radius: 6px; color: ${tabelaState.pagina === totalPaginas ? '#94a3b8' : '#333'}; font-weight: 600; transition: 0.2s;">
                Próximo
            </button>`;

    // 6. Monta o Rodapé e Injeta na Tela
    html += `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding: 10px 0; flex-wrap: wrap; gap: 10px;">
        <span style="font-size: 0.85rem; color: #64748b; font-weight: 500;">
            Mostrando ${inicio + 1} a ${Math.min(fim, dadosFiltrados.length)} de ${dadosFiltrados.length} registros
        </span>
        <div style="display: flex; gap: 5px; align-items: center;">
            ${paginacaoHtml}
        </div>
    </div>`;

    subContainer.innerHTML = html;
}
// ==========================================
// USUÁRIOS
// ==========================================
function abrirModalUsuario(id) {
  const item = dadosTabelaAtual.find(u => Number(u.id) === Number(id));
  if(item) {
    document.getElementById("editUsuarioId").value = item.id;
    document.getElementById("infoUsuarioNome").textContent = item.nome + " " + (item.sobrenome || "");
    document.getElementById("infoUsuarioEmail").textContent = item.email;
    document.getElementById("editUsuarioTipo").value = item.tipo;
    document.getElementById("editUsuarioAtivo").value = item.ativo;
    
    document.getElementById("modalUsuario").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}

function fecharModalUsuario() {
  document.getElementById("modalUsuario").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditUsuario").textContent = "";
}

document.getElementById("formEditarUsuario")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { 
    id: document.getElementById("editUsuarioId").value, 
    tipo: document.getElementById("editUsuarioTipo").value,
    ativo: document.getElementById("editUsuarioAtivo").value
  };
  await enviarAtualizacao(`${BASE_URL}/admin/atualizar_usuario.php`, payload, "msgEditUsuario", fecharModalUsuario, "usuarios");
});

async function excluirUsuario(id) {
  if (!confirm("Atenção: A exclusão de um usuário apagará também os seus pets vinculados e inscrições em eventos. Deseja prosseguir?")) return;

  try {
    const response = await fetch(`${BASE_URL}/admin/excluir_usuario.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` },
      body: JSON.stringify({ id: id })
    });

    if (response.status === 401 || response.status === 403) { fazerLogout(); return; }
    
    const resultado = await response.json();
    if (resultado.success) {
      carregarDadosTabelaDashboard('usuarios', 'container-tabela-usuarios'); 
      carregarSecao('usuarios');
    } else {
      alert(resultado.message);
    }
  } catch (error) {
    alert("Erro de conexão ao tentar excluir.");
  }
}
