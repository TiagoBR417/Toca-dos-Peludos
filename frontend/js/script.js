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

//painel ADM
document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll('.dashboard-grid .card');
  const secaoDetalhes = document.getElementById('secao-detalhes');
  const tituloSecao = document.getElementById('titulo-secao');
  const cabecalhoTabela = document.getElementById('cabecalho-tabela');
  const corpoTabela = document.getElementById('corpo-tabela');

  
  if (cards.length > 0 && secaoDetalhes) {
      
    
      cards.forEach(card => {
          card.addEventListener('click', () => {
              const tipo = card.getAttribute('data-tipo'); 
              
              
              secaoDetalhes.style.display = 'block';
              corpoTabela.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando dados...</td></tr>';

              
              if (tipo === 'denuncias') {
                  tituloSecao.innerText = 'Gerenciar Denúncias';
                  carregarTabelaDenunciasPainel(cabecalhoTabela, corpoTabela);
              } 
              else if (tipo === 'pets') {
                  tituloSecao.innerText = 'Gerenciar Pets';
                  carregarTabelaPetsPainel(cabecalhoTabela, corpoTabela);
              }
              else {
                  tituloSecao.innerText = `Gerenciar ${tipo}`;
                  cabecalhoTabela.innerHTML = '<th>Aviso</th>';
                  corpoTabela.innerHTML = '<tr><td>Módulo ainda em desenvolvimento.</td></tr>';
              }
          });
      });
  }
});


async function carregarTabelaDenunciasPainel(cabecalho, corpo) {

  cabecalho.innerHTML = `
      <th>ID</th>
      <th>Tipo</th>
      <th>Descrição</th>
      <th>Local</th>
      <th>Contato</th>
      <th>Data</th>
  `;

  try {
      const response = await fetch('http://localhost/Toca-dos-Peludos/api/denuncias.php');
      const denuncias = await response.json();
      
      corpo.innerHTML = ''; // Limpa o "Carregando..."
      
      denuncias.forEach(d => {
          const contato = d.anonimo == 1 ? '<span style="color:#e74c3c; font-weight:bold;">Anônimo</span>' : (d.contato || '-');
          const dataFormatada = new Date(d.data_denuncia).toLocaleDateString('pt-BR');
          
          corpo.innerHTML += `
              <tr>
                  <td>#${d.id}</td>
                  <td><strong>${d.tipo}</strong></td>
                  <td>${d.descricao}</td>
                  <td>${d.localizacao || '-'}</td>
                  <td>${contato}</td>
                  <td>${dataFormatada}</td>
              </tr>
          `;
      });
  } catch (e) {
      corpo.innerHTML = '<tr><td colspan="6">Erro ao buscar denúncias.</td></tr>';
  }
}

// --- FUNÇÃO PARA CARREGAR PETS ---
async function carregarTabelaPetsPainel(cabecalho, corpo) {
  // Monta o cabeçalho específico para pets
  cabecalho.innerHTML = `
      <th>ID</th>
      <th>Foto</th>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Porte</th>
      <th>Status</th>
  `;

  try {
      const response = await fetch('http://localhost/Toca-dos-Peludos/api/pets.php');
      const pets = await response.json();
      
      corpo.innerHTML = ''; 
      
      pets.forEach(p => {
          // Estilo dinâmico pro status ficar bonito
          const corStatus = p.status === 'DISPONÍVEL' ? 'green' : 'orange';
          
          corpo.innerHTML += `
              <tr>
                  <td>#${p.id}</td>
                  <td><img src="${p.imagemUrl}" alt="foto" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;"></td>
                  <td><strong>${p.nome}</strong></td>
                  <td>${p.tipo}</td>
                  <td>${p.porte}</td>
                  <td><span style="color: ${corStatus}; font-weight: 600;">${p.status}</span></td>
              </tr>
          `;
      });
  } catch (e) {
      corpo.innerHTML = '<tr><td colspan="6">Erro ao buscar pets.</td></tr>';
  }
}