document.addEventListener("DOMContentLoaded", async () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuarioLogado || !usuarioLogado.token) {
    window.location.href = "login.html";
    return;
  }

  // 1. Injeta dados estáticos iniciais guardados no LocalStorage
  document.getElementById("saudacaoNome").innerText = `Olá, ${usuarioLogado.nome}!`;
  document.getElementById("txtNome").innerText = `${usuarioLogado.nome} ${usuarioLogado.sobrenome || ''}`;
  document.getElementById("txtEmail").innerText = usuarioLogado.email;
  document.getElementById("txtTelefone").innerText = usuarioLogado.telefone || 'Não informado';

  // Carrega foto salva localmente se houver
  if (localStorage.getItem(`foto_perfil_${usuarioLogado.email}`)) {
    document.getElementById("avatarUsuario").src = localStorage.getItem(`foto_perfil_${usuarioLogado.email}`);
  }

  // 2. Busca informações operacionais do banco de dados
  try {
    const response = await fetch(`${BASE_URL}/site/perfil.php`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${usuarioLogado.token}` }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
      return;
    }

    const resultado = await response.json();

    if (resultado.success) {
      // Atualiza os contadores estáticos nas caixas superiores
      document.getElementById("statVisitas").innerText = resultado.data.visitas ? resultado.data.visitas.length : 0;
      document.getElementById("statEventos").innerText = resultado.data.eventos ? resultado.data.eventos.length : 0;

      renderizarVisitas(resultado.data.visitas);
      renderizarEventos(resultado.data.eventos);
      renderizarMeusPets(resultado.data.meus_pets || []); // Garante fallback caso venha vazio
    }
  } catch (error) {
    console.error("Erro ao carregar os dados consolidados do perfil:", error);
  }
});

// OPERAÇÃO: MODAIS CONTROLE DE INTERFACE
function abrirModalTelefone() {
  const telAtual = document.getElementById("txtTelefone").innerText;
  document.getElementById("novoTelefone").value = telAtual === 'Não informado' ? '' : telAtual;
  exibirModal("modalTelefone");
}

function abrirModalSenha() {
  document.getElementById("formSenha").reset();
  exibirModal("modalSenha");
}

function abrirModalPet(id = null, nome = '', especie = 'Cachorro', idade = '') {
  document.getElementById("formPet").reset();
  document.getElementById("petId").value = id;
  document.getElementById("nomePet").value = nome;
  document.getElementById("especiePet").value = especie;
  document.getElementById("idadePet").value = idade;
  exibirModal("modalPet");
}

function exibirModal(id) {
  document.getElementById(id).style.display = "flex";
  document.body.classList.add("no-scroll");
}

function fecharModais() {
  document.querySelectorAll(".modal-perfil-container").forEach(m => m.style.display = "none");
  document.body.classList.remove("no-scroll");
}

// OPERAÇÃO: ENVIO DE ATUALIZAÇÕES PARA O BANCO
async function salvarTelefone(event) {
  event.preventDefault();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const novoTel = document.getElementById("novoTelefone").value;

  try {
    const response = await fetch(`${BASE_URL}/site/atualizar_perfil.php`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuarioLogado.token}` 
      },
      body: JSON.stringify({ acao: 'telefone', telefone: novoTel })
    });

    const resultado = await response.json();
    if (resultado.success) {
      document.getElementById("txtTelefone").innerText = novoTel;
      usuarioLogado.telefone = novoTel;
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      fecharModais();
      alert("Telefone atualizado com sucesso!");
    } else {
      alert(resultado.message || "Erro ao atualizar.");
    }
  } catch (e) {
    alert("Erro na conexão com o servidor.");
  }
}

async function salvarSenha(event) {
  event.preventDefault();
  const senhaAtual = document.getElementById("senhaAtual").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const confirmaSenha = document.getElementById("confirmaSenha").value;

  if (novaSenha !== confirmaSenha) {
    alert("A nova senha e a confirmação não coincidem!");
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  try {
    const response = await fetch(`${BASE_URL}/site/atualizar_perfil.php`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuarioLogado.token}` 
      },
      body: JSON.stringify({ acao: 'senha', senha_atual: senhaAtual, nova_senha: novaSenha })
    });

    const resultado = await response.json();
    if (resultado.success) {
      fecharModais();
      alert("Senha modificada com sucesso!");
    } else {
      alert(resultado.message || "Senha atual incorreta.");
    }
  } catch (e) {
    alert("Erro na conexão com o servidor.");
  }
}

async function salvarPet(event) {
  event.preventDefault();
  const id = document.getElementById("petId").value;
  const nome = document.getElementById("nomePet").value;
  const especie = document.getElementById("especiePet").value;
  const idade = document.getElementById("idadePet").value;
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  try {
    const response = await fetch(`${BASE_URL}/site/gerenciar_meus_pets.php`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuarioLogado.token}` 
      },
      body: JSON.stringify({ id, nome, especie, idade })
    });

    const resultado = await response.json();
    if (resultado.success) {
      renderizarMeusPets(resultado.data); // Back-end retorna a lista atualizada de pets
      fecharModais();
    }
  } catch (e) {
    alert("Erro ao gravar dados do pet.");
  }
}

// Upload de foto simulado via Base64 integrado ao LocalStorage
function atualizarFotoPerfil(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    
    reader.onload = function(e) {
      document.getElementById("avatarUsuario").src = e.target.result;
      localStorage.setItem(`foto_perfil_${usuarioLogado.email}`, e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// RENDERIZAÇÃO DAS SEÇÕES OPERACIONAIS
function renderizarMeusPets(pets) {
  const div = document.getElementById("listaMeusPets");
  if (!pets || pets.length === 0) {
    div.innerHTML = "<p style='color: #777;'>Você ainda não cadastrou nenhuma informação sobre seus pets pessoais.</p>";
    return;
  }

  let html = '';
  pets.forEach(p => {
    html += `
      <div class="pet-user-card">
        <div class="pet-user-info">
          <h4>${p.nome}</h4>
          <p><strong>Espécie:</strong> ${p.especie} | <strong>Idade:</strong> ${p.idade}</p>
        </div>
        <button class="btn-acao-perfil" onclick="abrirModalPet(${p.id}, '${p.nome}', '${p.especie}', '${p.idade}')">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </div>`;
  });
  div.innerHTML = html;
}

function renderizarVisitas(visitas) {
  const div = document.getElementById("listaVisitas");
  if (!visitas || visitas.length === 0) {
    div.innerHTML = "<p>Você ainda não agendou nenhuma visita.</p>";
    return;
  }

  let html = `<table class="admin-table" style="width: 100%; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 12px; overflow: hidden; border-collapse: collapse;">
  <tr style="background: #f8f9fa; text-align: left; border-bottom: 2px solid #eee;">
    <th style="padding: 14px;">Pet</th>
    <th style="padding: 14px;">Data</th>
    <th style="padding: 14px;">Horário</th>
    <th style="padding: 14px;">Status</th>
  </tr>`;
              
  visitas.forEach(v => {
    const dataFormatada = new Date(v.data_visita).toLocaleDateString('pt-BR');
    let corStatus = v.status === 'agendado' ? '#f59e0b' : (v.status === 'confirmada' ? '#10b981' : '#ef4444');
      
    html += `<tr>
      <td style="padding: 14px; border-top: 1px solid #eee;"><strong>${v.nome_pet}</strong></td>
      <td style="padding: 14px; border-top: 1px solid #eee;">${dataFormatada}</td>
      <td style="padding: 14px; border-top: 1px solid #eee;">${v.horario_visita}</td>
      <td style="padding: 14px; border-top: 1px solid #eee; color: ${corStatus}; font-weight: bold; text-transform: capitalize;">• ${v.status}</td>
    </tr>`;
  });
  div.innerHTML = html + "</table>";
}

function renderizarEventos(eventos) {
  const div = document.getElementById("listaEventos");
  if (!eventos || eventos.length === 0) {
    div.innerHTML = "<p>Você ainda não se inscreveu em nenhum evento.</p>";
    return;
  }

  let html = `<table class="admin-table" style="width: 100%; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-radius: 12px; overflow: hidden; border-collapse: collapse;">
    <tr style="background: #f8f9fa; text-align: left; border-bottom: 2px solid #eee;">
      <th style="padding: 14px;">Evento</th>
      <th style="padding: 14px;">Data</th>
      <th style="padding: 14px;">Qtd. Pessoas</th>
      <th style="padding: 14px;">Status</th>
    </tr>`;
              
  eventos.forEach(e => {
    const dataObj = new Date(e.data_evento);
    const dataFormatada = `${String(dataObj.getUTCDate()).padStart(2, '0')}/${String(dataObj.getUTCMonth() + 1).padStart(2, '0')}/${dataObj.getUTCFullYear()}`;
    let corStatus = e.status === 'confirmada' ? '#10b981' : (e.status === 'cancelada' ? '#ef4444' : '#f59e0b');

    html += `<tr>
      <td style="padding: 14px; border-top: 1px solid #eee;"><strong>${e.evento_nome}</strong></td>
      <td style="padding: 14px; border-top: 1px solid #eee;">${dataFormatada}</td>
      <td style="padding: 14px; border-top: 1px solid #eee;">${e.quantidade_pessoas}</td>
      <td style="padding: 14px; border-top: 1px solid #eee; color: ${corStatus}; font-weight: bold; text-transform: capitalize;">• ${e.status}</td>
    </tr>`;
  });
  div.innerHTML = html + "</table>";
}