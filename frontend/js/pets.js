document.addEventListener("DOMContentLoaded", () => {
  carregarPets();

  // Escuta as digitações no campo de busca
  const inputBusca = document.getElementById("inputBusca");
  if (inputBusca) inputBusca.addEventListener("input", aplicarFiltros);

  // Escuta qualquer mudança nos selects e checkboxes para filtrar em TEMPO REAL
  const filtros = [
    "filtroTipo", "filtroPorte", "filtroIdade", "filtroSexo", "filtroEnergia",
    "chkCastrado", "chkVacinado", "chkCriancas", "chkOutrosPets"
  ];
  
  filtros.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.addEventListener("change", aplicarFiltros);
  });

  // Botão para limpar tudo
  const btnLimpar = document.getElementById("btnLimparFiltros");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      document.querySelectorAll(".select-filtro-item").forEach(el => el.value = "todos");
      document.querySelectorAll("input[type='checkbox']").forEach(el => el.checked = false);
      if (inputBusca) inputBusca.value = "";
      aplicarFiltros(); // Roda o filtro vazio para mostrar todos novamente
    });
  }

  // Lógica do botão de expandir filtros (Botão de +)
  const btnToggle = document.getElementById("btnToggleFiltros");
  const painelExtras = document.getElementById("painelFiltrosExtras");

  if (btnToggle && painelExtras) {
    btnToggle.addEventListener("click", () => {
      // Abre e fecha o painel
      painelExtras.classList.toggle("ativo");
      btnToggle.classList.toggle("ativo");
      
      // Muda o ícone de + para -
      const icone = btnToggle.querySelector(".icone-filtro");
      if (painelExtras.classList.contains("ativo")) {
        icone.textContent = "➖"; // Aberto
      } else {
        icone.textContent = "➕"; // Fechado
      }
    });
  }
});

let listaCompletaPets = [];

async function carregarPets() {
  const container = document.getElementById("listaPets");
  if (!container) return;

  try {
    const response = await fetch(`${API_PETS_URL}?status=disponivel`);
    const resultado = await response.json();

    if (!resultado.success) {
      container.innerHTML = `<p>${resultado.message}</p>`;
      return;
    }

    listaCompletaPets = resultado.data;
    renderizarPets(listaCompletaPets);
  } catch (error) {
    console.error("Erro ao carregar pets:", error);
    container.innerHTML = `<p>Erro ao carregar pets.</p>`;
  }
}

function aplicarFiltros() {
  const tipo = document.getElementById("filtroTipo")?.value.toLowerCase() || "todos";
  const porte = document.getElementById("filtroPorte")?.value.toLowerCase() || "todos";
  const idadeFiltro = document.getElementById("filtroIdade")?.value || "todos";
  const sexo = document.getElementById("filtroSexo")?.value.toLowerCase() || "todos";
  const energia = document.getElementById("filtroEnergia")?.value.toLowerCase() || "todos";
  
  const castrado = document.getElementById("chkCastrado")?.checked;
  const vacinado = document.getElementById("chkVacinado")?.checked;
  const criancas = document.getElementById("chkCriancas")?.checked;
  const outrosPets = document.getElementById("chkOutrosPets")?.checked;
  
  const termoBusca = document.getElementById("inputBusca")?.value.toLowerCase() || "";

  let filtrados = [...listaCompletaPets];

  // Filtros de Texto e Selects
  if (termoBusca) filtrados = filtrados.filter(p => (p.nome || "").toLowerCase().includes(termoBusca));
  if (tipo !== "todos") filtrados = filtrados.filter(p => (p.tipo || "").toLowerCase() === tipo);
  if (porte !== "todos") filtrados = filtrados.filter(p => (p.porte || "").toLowerCase() === porte);
  if (sexo !== "todos") filtrados = filtrados.filter(p => (p.sexo || "").toLowerCase() === sexo);
  if (energia !== "todos") filtrados = filtrados.filter(p => (p.nivel_energia || "").toLowerCase() === energia);
  
  // Lógica de Idade
  if (idadeFiltro !== "todos") {
    filtrados = filtrados.filter(p => {
      const idade = parseInt(p.idade);
      if (isNaN(idade)) return false; // Se a idade for nula, esconde do filtro restrito
      if (idadeFiltro === "filhote") return idade <= 1;
      if (idadeFiltro === "adulto") return idade >= 2 && idade <= 7;
      if (idadeFiltro === "idoso") return idade >= 8;
      return true;
    });
  }

  // Filtros Booleanos (Checkboxes) - Usamos parseInt porque o banco pode mandar '1' ou 1
  if (castrado) filtrados = filtrados.filter(p => parseInt(p.castrado) === 1);
  if (vacinado) filtrados = filtrados.filter(p => parseInt(p.vacinado) === 1);
  if (criancas) filtrados = filtrados.filter(p => parseInt(p.bom_com_criancas) === 1);
  if (outrosPets) filtrados = filtrados.filter(p => parseInt(p.bom_com_outros_pets) === 1);

  renderizarPets(filtrados);
}

function renderizarPets(pets) {
  const container = document.getElementById("listaPets");
  container.innerHTML = "";

  if (!pets.length) {
    container.innerHTML = `<p class="mensagem-vazia" style="grid-column: 1/-1; text-align: center; font-size: 18px; color: #777;">Poxa! Nenhum pet encontrado com esses filtros. Tente mudar algumas opções.</p>`;
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "card-pet";

    const nome = valorSeguro(pet.nome, "Pet sem nome");
    const tipo = valorSeguro(pet.tipo, "tipo não informado");
    const porte = valorSeguro(pet.porte, "porte não informado");
    const sexo = valorSeguro(pet.sexo, "sexo não informado");
    const idadeTxt = pet.idade != null ? `${pet.idade} ano(s)` : "Idade indefinida";
    const raca = valorSeguro(pet.raca, "Não informada");
    
    // Gerando Tags Visuais de Saúde/Comportamento
    // Gerando Tags Visuais Unificadas
    let tagsVisuais = `
      <span class="pet-card-tag tag-basica">${tipo}</span>
      <span class="pet-card-tag tag-basica">${porte}</span>
      <span class="pet-card-tag tag-basica">${sexo}</span>
    `;
    
    if (parseInt(pet.castrado) === 1) tagsVisuais += `<span class="pet-card-tag tag-saude">Castrado</span>`;
    if (parseInt(pet.vacinado) === 1) tagsVisuais += `<span class="pet-card-tag tag-saude">Vacinado</span>`;
    if (pet.nivel_energia) tagsVisuais += `<span class="pet-card-tag tag-energia">${pet.nivel_energia}</span>`;

    const descricao = valorSeguro(pet.descricao, "Esse pet está esperando por um novo lar cheio de amor.");
    const imagem = pet.imagem_url && pet.imagem_url.trim() !== "" ? pet.imagem_url : "https://placehold.co/400x260?text=Sem+Foto";
    const local = montarLocalizacao(pet.bairro, pet.cidade);

    card.innerHTML = `
      <div class="card-pet-image-wrapper">
        <img src="${imagem}" alt="${nome}" onerror="this.src='https://placehold.co/400x260?text=Sem+Foto'">
      </div>

      <div class="card-pet-content">
        <h3>${nome}</h3>
        
        <div class="tags-container">
          ${tagsVisuais}
        </div>

        <p class="pet-raca"><strong>Raça:</strong> ${raca}</p>
        <p class="pet-raca"><strong>Idade:</strong> ${idadeTxt}</p>
        <p class="pet-local"><strong>Local:</strong> ${local}</p>

        <p class="pet-descricao">${limitarTexto(descricao, 80)}</p>

        <a href="form_pets.html?id=${pet.id}" class="btn-ver-mais">Ver detalhes</a>
      </div>
    `;

    container.appendChild(card);
  });
}

function valorSeguro(valor, fallback) {
  if (valor === null || valor === undefined) return fallback;
  const texto = String(valor).trim();
  return texto !== "" ? texto : fallback;
}

function montarLocalizacao(bairro, cidade) {
  const bairroSeguro = bairro ? String(bairro).trim() : "";
  const cidadeSegura = cidade ? String(cidade).trim() : "";
  if (bairroSeguro && cidadeSegura) return `${bairroSeguro}, ${cidadeSegura}`;
  if (bairroSeguro) return bairroSeguro;
  if (cidadeSegura) return cidadeSegura;
  return "Local não informado";
}

function limitarTexto(texto, limite) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite).trim() + "...";
}