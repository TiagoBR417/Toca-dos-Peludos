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

//carregas os aniamis
async function carregarTabelaPetsPainel(cabecalho, corpo) {

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

//carrossel eventos 
const btnNext = document.getElementById('nextSlide')
   const btnPrevious = document.getElementById('previousSlide')
   const slider = document.querySelector('.slider')
   const content = document.querySelector('.content')
  
   const { width: slideWidth } = window.getComputedStyle(slider)
   const { width: contentWidth } = window.getComputedStyle(content)
   const contentLength = content.children.length;

   let currentSlide = 0;
  
   const slideProps = {
    width: parseInt(slideWidth),
    scroll: 0,
   }

   function setCurrentDot() {
    const dots = document.querySelectorAll('.dot') 
    for (let dot of dots){
      dot.classList.remove('current')
    }
    dots[currentSlide].classList.add('current')
   }
  
   function controlSlide({ target: { id }}){
    switch (id) {
      case 'nextSlide':{
        if (slideProps.scroll + slideProps.width < parseInt(contentWidth)) {
        slideProps.scroll += slideProps.width;
        }
        if (currentSlide < contentLength - 1){
          currentSlide += 1;
          setCurrentDot()
        }
        
        return slider.scrollLeft = slideProps.scroll;
      }
        
      
      case 'previousSlide':
        if(currentSlide > 0){
          currentSlide -= 1;
          setCurrentDot()         
        }
        slideProps.scroll = slideProps.scroll - slideProps.width < 0 ? 0: slideProps.scroll - slideProps.width ;
        return slider.scrollLeft = slideProps.scroll;
      
        
      default:
        break;
    }
   }
  
   btnNext.addEventListener('click', controlSlide)
   btnPrevious.addEventListener('click', controlSlide)

   window.onload = () => {
      const contentLength = content.children.length;
      for(let index = 0; index < contentLength - 1; index += 1){
        const newDot = slider.parentElement.querySelector('.dot').cloneNode(true);
        slider.parentElement.querySelector('.length-dots').appendChild(newDot)
      }
      setCurrentDot();
   }

// Gerar QRcode de valor qualquer

   function abrirModalPix() {
    document.getElementById('popupPix').style.display = 'block';
document.body.classList.add("no-scroll");
  }
 
  function fecharModalDoacao() {
    document.getElementById('popupPix').style.display = 'none';
document.body.classList.remove("no-scroll");
  }
 
  function calcularCRC16(payload) {
    let resultado = 0xFFFF;
    let polinomio = 0x1021;
 
    for (let i = 0; i < payload.length; i++) {
      resultado ^= (payload.charCodeAt(i) << 8);
      for (let bitwise = 0; bitwise < 8; bitwise++) {
        if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
        resultado &= 0xFFFF;
      }
    }
    return resultado.toString(16).toUpperCase().padStart(4, '0');
  }
 
  function gerarPix() {
    let valorInput = document.getElementById("valorDoacao").value.replace(',', '.');
    let valor = parseFloat(valorInput).toFixed(2);

    if (valor <= 0 || isNaN(valor)) {
        alert("Digite um valor válido");
        return;
    }

    const chavePix = "48712800805";
    const nome = "TIAGO OLIVEIRA DOS SANTOS";
    const cidade = "SAO PAULO";

    const formatField = (id, value) => {
        let size = String(value.length).padStart(2, '0');
        return id + size + value;
    };

    const merchantAccountInfo = formatField("26",
        formatField("00", "br.gov.bcb.pix") + formatField("01", chavePix)
    );

    const additionalDataFieldTemplate = formatField("62", formatField("05", "doacao-20260323-001"));

    let payloadBase = "000201" +
                      merchantAccountInfo +
                      formatField("52", "0000") +
                      formatField("53", "986") +
                      formatField("54", valor) +
                      formatField("58", "BR") +
                      formatField("59", nome) +
                      formatField("60", cidade) +
                      additionalDataFieldTemplate +
                      "6304";

    const payloadFinal = payloadBase + calcularCRC16(payloadBase);

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {
        text: payloadFinal,
        width: 200,
        height: 200
    });
}

//Gerar QRcode de 10 reais

function enviarDoacaoDezReais(){
  document.getElementById('popupPixDez').style.display = 'block';
document.body.classList.add("no-scroll");
};

function fecharModalDoacaoDez(){
  document.getElementById('popupPixDez').style.display = 'none'
document.body.classList.remove("no-scroll");
}

function gerarPixDezReais() {
  let valor = 10.00;  // Valor fixo de R$10,00

  const chavePix = "48712800805";
  const nome = "TIAGO OLIVEIRA DOS SANTOS";
  const cidade = "SAO PAULO";

  const formatField = (id, value) => {
    let size = String(value.length).padStart(2, '0');
    return id + size + value;
  };

  const merchantAccountInfo = formatField("26",
    formatField("00", "br.gov.bcb.pix") + formatField("01", chavePix)
  );

  const additionalDataFieldTemplate = formatField("62", formatField("05", "doacao-20260323-001"));

  let payloadBase = "000201" +
                    merchantAccountInfo +
                    formatField("52", "0000") +
                    formatField("53", "986") +
                    formatField("54", valor.toFixed(2)) +  // Aqui usamos o valor de 10.00 formatado
                    formatField("58", "BR") +
                    formatField("59", nome) +
                    formatField("60", cidade) +
                    additionalDataFieldTemplate +
                    "6304";

  const payloadFinal = payloadBase + calcularCRC16(payloadBase); // Calculando o CRC16 para o payload

  document.getElementById('qrcodeDez').innerHTML = ""; // Limpa o conteúdo anterior do QR Code

  new QRCode(document.getElementById('qrcodeDez'), {
    text: payloadFinal,
    width: 200,
    height: 200
  });
}


//Gerar QRcode de 20 reais

function enviarDoacaoVinteReais(){
  document.getElementById('popupPixVinte').style.display = 'block';
document.body.classList.add("no-scroll");
};

function fecharModalDoacaoVinte(){
  document.getElementById('popupPixVinte').style.display = 'none'
document.body.classList.remove("no-scroll");  
}

function gerarPixVinteReais() {
  let valor = 20.00;  // Valor fixo de R$20,00

  const chavePix = "48712800805";
  const nome = "TIAGO OLIVEIRA DOS SANTOS";
  const cidade = "SAO PAULO";

  const formatField = (id, value) => {
    let size = String(value.length).padStart(2, '0');
    return id + size + value;
  };

  const merchantAccountInfo = formatField("26",
    formatField("00", "br.gov.bcb.pix") + formatField("01", chavePix)
  );

  const additionalDataFieldTemplate = formatField("62", formatField("05", "doacao-20260323-001"));

  let payloadBase = "000201" +
                    merchantAccountInfo +
                    formatField("52", "0000") +
                    formatField("53", "986") +
                    formatField("54", valor.toFixed(2)) +  // Aqui usamos o valor de 20.00 formatado
                    formatField("58", "BR") +
                    formatField("59", nome) +
                    formatField("60", cidade) +
                    additionalDataFieldTemplate +
                    "6304";

  const payloadFinal = payloadBase + calcularCRC16(payloadBase); // Calculando o CRC16 para o payload

  document.getElementById('qrcodeVinte').innerHTML = ""; // Limpa o conteúdo anterior do QR Code

  new QRCode(document.getElementById('qrcodeVinte'), {
    text: payloadFinal,
    width: 200,
    height: 200
  });
}

//Gerar QRcode de 50 reais

function enviarDoacaoCinquentaReais(){
  document.getElementById('popupPixCinquenta').style.display = 'block';
document.body.classList.add("no-scroll");
};

function fecharModalDoacaoCinquenta(){
  document.getElementById('popupPixCinquenta').style.display = 'none'
document.body.classList.remove("no-scroll");
}

function gerarPixCinquentaReais() {
  let valor = 50.00;  // Valor fixo de R$50,00

  const chavePix = "48712800805";
  const nome = "TIAGO OLIVEIRA DOS SANTOS";
  const cidade = "SAO PAULO";

  const formatField = (id, value) => {
    let size = String(value.length).padStart(2, '0');
    return id + size + value;
  };

  const merchantAccountInfo = formatField("26",
    formatField("00", "br.gov.bcb.pix") + formatField("01", chavePix)
  );

  const additionalDataFieldTemplate = formatField("62", formatField("05", "doacao-20260323-001"));

  let payloadBase = "000201" +
                    merchantAccountInfo +
                    formatField("52", "0000") +
                    formatField("53", "986") +
                    formatField("54", valor.toFixed(2)) +  // Aqui usamos o valor de 50.00 formatado
                    formatField("58", "BR") +
                    formatField("59", nome) +
                    formatField("60", cidade) +
                    additionalDataFieldTemplate +
                    "6304";

  const payloadFinal = payloadBase + calcularCRC16(payloadBase); // Calculando o CRC16 para o payload

  document.getElementById('qrcodeCinquenta').innerHTML = ""; // Limpa o conteúdo anterior do QR Code

  new QRCode(document.getElementById('qrcodeCinquenta'), {
    text: payloadFinal,
    width: 200,
    height: 200
  });
}