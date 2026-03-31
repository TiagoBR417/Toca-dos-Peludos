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
    container.innerHTML = `<p>Nenhum pet encontrado.</p>`;
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "card-pet";

    card.innerHTML = `
      <img src="${pet.imagem_url || "https://placehold.co/300x200?text=Sem+Foto"}" alt="${pet.nome}">
      <div class="card-pet-info">
        <h3>${pet.nome}</h3>
        <p>${pet.tipo} • ${pet.porte || "porte não informado"}</p>
        <p>${pet.raca || "raça não informada"}</p>
        <a href="detalhes.html?id=${pet.id}" class="link-ver-mais">Ver mais &rarr;</a>
      </div>
    `;

    container.appendChild(card);
  });
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
