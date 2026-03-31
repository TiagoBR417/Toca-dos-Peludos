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








const btnNext = document.getElementById('nextSlide')
   const btnPrevious = document.getElementById('previousSlide')
   const slider = document.querySelector('.slider')
   const content = document.querySelector('.content')
  
   const { width: slideWidth } = window.getComputedStyle(slider)
   const { width: contentWidth } = window.getComputedStyle(content)
   const contentLength = content.children.length;
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

  const { width: slideWidth } = window.getComputedStyle(slider);
  const { width: contentWidth } = window.getComputedStyle(content);
  const contentLength = content.children.length;

  let currentSlide = 0;

  const slideProps = {
    width: parseInt(slideWidth),
    scroll: 0,
  };

  function setCurrentDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("current"));
    if (dots[currentSlide]) dots[currentSlide].classList.add("current");
  }

  function controlSlide({ target: { id } }) {
    switch (id) {
      case "nextSlide":
        if (slideProps.scroll + slideProps.width < parseInt(contentWidth)) {
          slideProps.scroll += slideProps.width;
        }
        if (currentSlide < contentLength - 1) {
          currentSlide += 1;
          setCurrentDot();
        }
        slider.scrollLeft = slideProps.scroll;
        break;

      case "previousSlide":
        if (currentSlide > 0) {
          currentSlide -= 1;
          setCurrentDot();
        }
        slideProps.scroll =
          slideProps.scroll - slideProps.width < 0
            ? 0
            : slideProps.scroll - slideProps.width;
        slider.scrollLeft = slideProps.scroll;
        break;
    }
  }

  btnNext.addEventListener("click", controlSlide);
  btnPrevious.addEventListener("click", controlSlide);

  window.addEventListener("load", () => {
    for (let index = 0; index < contentLength - 1; index += 1) {
      const firstDot = slider.parentElement.querySelector(".dot");
      if (firstDot) {
        const newDot = firstDot.cloneNode(true);
        slider.parentElement.querySelector(".length-dots").appendChild(newDot);
      }
    }
    setCurrentDot();
  });
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
      const card = document.createElement("div");
      card.className = "evento-card";

      const dataFormatada = evento.data_evento
        ? new Date(evento.data_evento).toLocaleDateString("pt-BR")
        : "Data não informada";

      card.innerHTML = `
        <h3>${evento.titulo}</h3>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <p>${evento.descricao || ""}</p>
        <a href="form_eventos.html?evento_id=${evento.id}" class="btn-accent">Participar</a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    container.innerHTML = `<p>Erro ao carregar eventos.</p>`;
  }
}