// Carrossel 
document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrossel();
  carregarEventos();
});

function iniciarCarrossel() {
  const btnNext = document.getElementById("nextSlide");
  const btnPrevious = document.getElementById("previousSlide");
  const slider = document.querySelector(".slider");
  const content = document.querySelector(".content");

  if (!btnNext || !btnPrevious || !slider || !content) return;

  const slideWidth = slider.offsetWidth;
  const contentWidth = content.scrollWidth;
  const contentLength = content.children.length;

  let currentSlide = 0;
  let scroll = 0;
  
  // Rodar o carossel
  let autoplay = setInterval(() => {
    btnNext.click();
  }, 5000); // muda a cada 5 segundos

  function setCurrentDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("current"));
    if (dots[currentSlide]) dots[currentSlide].classList.add("current");
  }

  function controlSlide(e) {
    if (e.target.id === "nextSlide") {
      if (scroll + slideWidth < contentWidth) {
        scroll += slideWidth;
        currentSlide++;
      } else {
        scroll = 0;
        currentSlide = 0;
      }
    } else {
      if (scroll > 0) {
        scroll -= slideWidth;
        currentSlide--;
      }
    }
  
    slider.scrollLeft = scroll;
    setCurrentDot();
  }

  btnNext.addEventListener("click", controlSlide);
  btnPrevious.addEventListener("click", controlSlide);

  // Criar dots
  const dotsContainer = slider.parentElement.querySelector(".length-dots");
  const firstDot = dotsContainer?.querySelector(".dot");

  if (dotsContainer && firstDot) {
    for (let i = 1; i < contentLength; i++) {
      dotsContainer.appendChild(firstDot.cloneNode(true));
    }
  }

  // Quando o mouse sair começar a rodar o carrossel
  slider.addEventListener("mouseleave", () => {
    if (!autoplay) {
      autoplay = setInterval(() => {
        btnNext.click();
      }, 5000);
    }
  });
  
  // Parar o carrossel se o mouse estiver em cima 
  slider.addEventListener("mouseenter", () => {
    clearInterval(autoplay);
    autoplay = null;
  });

  setCurrentDot();
}

// VARIÁVEIS PAGINAÇÃO EVENTOS
let listaCompletaEventos = [];
let paginaAtualEvento = 1;
const itensPorPaginaEvento = 2; // numero de eventos por page

async function carregarEventos() {
  const container = document.getElementById("listaEventos");
  if (!container) return;

  try {
    const response = await fetch(API_EVENTOS_URL);
    const resultado = await response.json();

    if (!resultado.success) {
      container.innerHTML = `<p>${resultado.message}</p>`;
      return;
    }

    // Salva todos os eventos na variável global
    listaCompletaEventos = resultado.data;

    if (!listaCompletaEventos.length) {
      container.innerHTML = `<p>Nenhum evento disponível no momento.</p>`;
      return;
    }

    // Chama a função que mostra a página 1
    mostrarPaginaEvento();

  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    container.innerHTML = `<p>Erro ao carregar eventos.</p>`;
  }
}

function mostrarPaginaEvento() {
  // Matemática para fatiar o Array
  const indiceInicio = (paginaAtualEvento - 1) * itensPorPaginaEvento;
  const indiceFim = indiceInicio + itensPorPaginaEvento;
  
  // Corta só os eventos da página atual
  const eventosDaPagina = listaCompletaEventos.slice(indiceInicio, indiceFim);

  renderizarEventos(eventosDaPagina);
  renderizarPaginacaoEventos();
}

function renderizarEventos(eventos) {
  const container = document.getElementById("listaEventos");
  container.innerHTML = ""; // Limpa a tela antes de desenhar a nova página

  eventos.forEach((evento) => {
    const card = document.createElement("article");
    card.className = "evento-card";

    const dataFormatada = evento.data_evento
      ? new Date(evento.data_evento).toLocaleDateString("pt-BR")
      : "Data não informada";

    const imagem = evento.imagem_url && evento.imagem_url.trim() !== ""
      ? evento.imagem_url
      : "https://placehold.co/420x260?text=Evento";

    card.innerHTML = `
      <div class="evento-card-info">
        <h3>${evento.titulo}</h3>

        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <p class="evento-descricao">${evento.descricao || "Evento sem descrição."}</p>

        <a href="form_eventos.html?evento_id=${evento.id}" class="btn-evento">
          Confirme sua presença
        </a>
      </div>

      <div class="evento-card-imagem">
        <img 
          src="${imagem}" 
          alt="${evento.titulo}"
          onerror="this.src='https://placehold.co/420x260?text=Evento'"
        >
      </div>
    `;

    container.appendChild(card);
  });
}

function renderizarPaginacaoEventos() {
  const container = document.getElementById("paginacaoEventos");
  if (!container) return;
  container.innerHTML = "";

  const totalPaginas = Math.ceil(listaCompletaEventos.length / itensPorPaginaEvento);
  
  // Se só tiver 1 página, esconde os botões
  if (totalPaginas <= 1) return; 

  // Botão "Anterior"
  if (paginaAtualEvento > 1) {
    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.className = "btn-paginacao";
    btnAnterior.onclick = () => { 
      paginaAtualEvento--; 
      mostrarPaginaEvento(); 
      // Rola a página para o título dos eventos suavemente
      document.querySelector('.secao-eventos').scrollIntoView({ behavior: 'smooth' });
    };
    container.appendChild(btnAnterior);
  }

  // Botões Numéricos (1, 2, 3...)
  for (let i = 1; i <= totalPaginas; i++) {
    const btnNumero = document.createElement("button");
    btnNumero.textContent = i;
    btnNumero.className = `btn-paginacao ${i === paginaAtualEvento ? "ativo" : ""}`;
    btnNumero.onclick = () => { 
      paginaAtualEvento = i; 
      mostrarPaginaEvento(); 
      document.querySelector('.secao-eventos').scrollIntoView({ behavior: 'smooth' });
    };
    container.appendChild(btnNumero);
  }

  // Botão "Próxima"
  if (paginaAtualEvento < totalPaginas) {
    const btnProxima = document.createElement("button");
    btnProxima.textContent = "Próxima";
    btnProxima.className = "btn-paginacao";
    btnProxima.onclick = () => { 
      paginaAtualEvento++; 
      mostrarPaginaEvento(); 
      document.querySelector('.secao-eventos').scrollIntoView({ behavior: 'smooth' });
    };
    container.appendChild(btnProxima);
  }
}