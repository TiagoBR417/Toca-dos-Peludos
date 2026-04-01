// Aguarda o carregamento completo do HTML para rodar o script
document.addEventListener("DOMContentLoaded", function() {
    const menuSanduiche = document.querySelector('.menu-sanduiche');
    const navLinks = document.querySelector('.links');
  
  
    if (menuSanduiche && navLinks) {
      menuSanduiche.addEventListener('click', () => {
        // Liga e desliga a classe 'ativo' nos links
        navLinks.classList.toggle('ativo');
      });
    } else {
      console.error("Erro: Não encontrei o menu ou os links no HTML.");
    }
  });
  
  
document.addEventListener("DOMContentLoaded", () => {
  carregarPets();

  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", aplicarFiltros);
  }

  const inputBusca = document.getElementById("inputBusca");
  if (inputBusca) {
    inputBusca.addEventListener("input", aplicarFiltros);
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

function renderizarPets(pets) {
  const container = document.getElementById("listaPets");
  container.innerHTML = "";

  if (!pets.length) {
    container.innerHTML = `<p class="mensagem-vazia">Nenhum pet encontrado.</p>`;
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "card-pet";

    const imagem = pet.imagem_url && pet.imagem_url.trim() !== ""
      ? pet.imagem_url
      : "https://placehold.co/400x260?text=Sem+Foto";

    const statusTexto = pet.status ? pet.status : "disponivel";
    const statusClasse = `status-${statusTexto.toLowerCase()}`;

    card.innerHTML = `
  <div class="card-pet-image-wrapper">
    <img 
      src="${imagem}" 
      alt="${pet.nome}"
      onerror="this.src='https://placehold.co/400x260?text=Sem+Foto'"
    >
    <span class="badge-status ${statusClasse}">
      ${statusTexto}
    </span>
  </div>

  <div class="card-pet-content">
    <h3>${pet.nome}</h3>

    <div class="pet-meta">
      <span>${pet.tipo}</span>
      <span>${pet.porte}</span>
    </div>

    <p class="pet-raca">
      <strong>Raça:</strong> ${pet.raca}
    </p>

    <p class="pet-local">
      <strong>Local:</strong> ${pet.bairro}, ${pet.cidade}
    </p>

    <p class="pet-descricao">
      ${pet.descricao}
    </p>

    <a href="detalhes.html?id=${pet.id}" class="btn-ver-mais">
      Ver detalhes
    </a>
  </div>
`;

    container.appendChild(card);
  });
}

function limitarTexto(texto, limite) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite).trim() + "...";
}

function aplicarFiltros() {
  const tipoSelecionado = document.getElementById("filtroTipo").value.toLowerCase();
  const termoBusca = document.getElementById("inputBusca").value.toLowerCase();

  let petsFiltrados = [...listaCompletaPets];

  if (tipoSelecionado !== "todos") {
    petsFiltrados = petsFiltrados.filter(
      (pet) => (pet.tipo || "").toLowerCase() === tipoSelecionado
    );
  }

  if (termoBusca) {
    petsFiltrados = petsFiltrados.filter(
      (pet) => (pet.nome || "").toLowerCase().includes(termoBusca)
    );
  }

  renderizarPets(petsFiltrados);
}
