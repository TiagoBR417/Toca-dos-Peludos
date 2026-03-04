//animação depoimentos

const elemento = document.getElementById('texto-animado');
const frases = [
  "Veja Alguns Depoimentos Dos Nossos Adotantes",
  "Salve uma Vida",
  "Alegre o coração de um pet"
];

let fraseIndex = 0;
let caractereIndex = 0;
let deletando = false;

function animarTexto() {
  const fraseAtual = frases[fraseIndex];
  
  if (deletando) {
    elemento.textContent = fraseAtual.substring(0, caractereIndex - 1);
    caractereIndex--;
  } else {
    elemento.textContent = fraseAtual.substring(0, caractereIndex + 1);
    caractereIndex++;
  }

  let velocidade = deletando ? 50 : 100;

  if (!deletando && caractereIndex === fraseAtual.length) {
    velocidade = 2000;
    deletando = true;
  } else if (deletando && caractereIndex === 0) {
    deletando = false;
    fraseIndex = (fraseIndex + 1) % frases.length;
    velocidade = 500;
  }

  setTimeout(animarTexto, velocidade);
}

animarTexto();

function initCarousel() {
  const container = document.getElementById('depoimentos');
  if (!container) return;
  const track = container.querySelector('.slide-track');
  const items = Array.from(track.children);
  const prev = container.querySelector('.carousel-prev');
  const next = container.querySelector('.carousel-next');
  let index = 0;
  let autoplay = true;

  function goTo(i) {
    index = (i + items.length) % items.length;
    const target = items[index];
    const offset = target.offsetLeft;
    track.style.transform = 'translateX(' + (-offset) + 'px)';
  }

  function onNext() { goTo(index + 1); }
  function onPrev() { goTo(index - 1); }

  if (prev) prev.addEventListener('click', onPrev);
  if (next) next.addEventListener('click', onNext);
  container.addEventListener('mouseenter', function() { autoplay = false; });
  container.addEventListener('mouseleave', function() { autoplay = true; });

  goTo(0);
  setInterval(function() {
    if (autoplay) onNext();
  }, 3000);
}

document.addEventListener('DOMContentLoaded', initCarousel);
