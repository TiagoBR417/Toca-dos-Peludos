document.addEventListener("DOMContentLoaded", function() {
  const menuSanduiche = document.querySelector('.menu-sanduiche');
  const navLinks = document.querySelector('.links');

  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener('click', () => {
      navLinks.classList.toggle('ativo');
    });
  } else {
    console.error("Erro: Não encontrei o menu ou os links no HTML.");
  }
});

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

    const eventos = resultado.data;
    container.innerHTML = "";

    if (!eventos.length) {
      container.innerHTML = `<p>Nenhum evento disponível no momento.</p>`;
      return;
    }

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
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    container.innerHTML = `<p>Erro ao carregar eventos.</p>`;
  }
}