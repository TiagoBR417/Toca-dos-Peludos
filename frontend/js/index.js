// 🎯 ANIMAÇÃO DE TEXTO
const elemento = document.getElementById('texto-animado');

if (elemento) {
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
}

// 🎠 CARROSSEL
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
  let autoplay;

  function setCurrentDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("current"));
    dots[currentSlide]?.classList.add("current");
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

  function startAutoplay() {
    autoplay = setInterval(() => btnNext.click(), 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Criar dots
  const dotsContainer = slider.parentElement.querySelector(".length-dots");
  const firstDot = dotsContainer?.querySelector(".dot");

  if (dotsContainer && firstDot) {
    for (let i = 1; i < contentLength; i++) {
      dotsContainer.appendChild(firstDot.cloneNode(true));
    }
  }

  setCurrentDot();
  startAutoplay();
}

// 🧾 PAINEL ADM
function initPainelADM() {
  const cards = document.querySelectorAll('.dashboard-grid .card');
  const secaoDetalhes = document.getElementById('secao-detalhes');
  const tituloSecao = document.getElementById('titulo-secao');
  const cabecalhoTabela = document.getElementById('cabecalho-tabela');
  const corpoTabela = document.getElementById('corpo-tabela');

  if (!cards.length || !secaoDetalhes) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const tipo = card.dataset.tipo;

      secaoDetalhes.style.display = 'block';
      corpoTabela.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';

      if (tipo === 'denuncias') {
        tituloSecao.innerText = 'Gerenciar Denúncias';
        carregarTabelaDenuncias(cabecalhoTabela, corpoTabela);
      } else if (tipo === 'pets') {
        tituloSecao.innerText = 'Gerenciar Pets';
        carregarTabelaPets(cabecalhoTabela, corpoTabela);
      }
    });
  });
}

// 📡 API DENÚNCIAS
async function carregarTabelaDenuncias(cabecalho, corpo) {
  cabecalho.innerHTML = `
    <th>ID</th><th>Tipo</th><th>Descrição</th>
    <th>Local</th><th>Contato</th><th>Data</th>
  `;

  try {
    const res = await fetch('http://localhost/Toca-dos-Peludos/api/denuncias.php');
    const dados = await res.json();

    let html = "";

    dados.forEach(d => {
      const contato = d.anonimo == 1 ? "Anônimo" : (d.contato || "-");
      const data = new Date(d.data_denuncia).toLocaleDateString('pt-BR');

      html += `
        <tr>
          <td>#${d.id}</td>
          <td>${d.tipo}</td>
          <td>${d.descricao}</td>
          <td>${d.localizacao || '-'}</td>
          <td>${contato}</td>
          <td>${data}</td>
        </tr>
      `;
    });

    corpo.innerHTML = html;

  } catch (e) {
    console.error(e);
    corpo.innerHTML = '<tr><td colspan="6">Erro ao carregar</td></tr>';
  }
}

// 🐶 API PETS
async function carregarTabelaPets(cabecalho, corpo) {
  cabecalho.innerHTML = `
    <th>ID</th><th>Foto</th><th>Nome</th>
    <th>Tipo</th><th>Porte</th><th>Status</th>
  `;

  try {
    const res = await fetch('http://localhost/Toca-dos-Peludos/api/pets.php');
    const pets = await res.json();

    let html = "";

    pets.forEach(p => {
      const cor = p.status === 'DISPONÍVEL' ? 'green' : 'orange';

      html += `
        <tr>
          <td>#${p.id}</td>
          <td><img src="${p.imagemUrl}" width="40"></td>
          <td>${p.nome}</td>
          <td>${p.tipo}</td>
          <td>${p.porte}</td>
          <td style="color:${cor}">${p.status}</td>
        </tr>
      `;
    });

    corpo.innerHTML = html;

  } catch (e) {
    console.error(e);
    corpo.innerHTML = '<tr><td colspan="6">Erro ao carregar</td></tr>';
  }
}

// 💰 PIX (VERSÃO PROFISSIONAL)
document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("popupPix");
  const fecharModal = document.getElementById("fecharModal");
  const botoesDoar = document.querySelectorAll(".btn-doar");
  const btnOutroValor = document.getElementById("btnOutroValor");

  const inputValor = document.getElementById("valorDoacao");
  const tituloModal = document.getElementById("tituloModal");
  const btnGerarPix = document.getElementById("btnGerarPix");

  let valorSelecionado = null;

  // 👉 abrir modal com valor fixo
  botoesDoar.forEach(btn => {
    btn.addEventListener("click", () => {
      valorSelecionado = parseFloat(btn.dataset.valor);
      tituloModal.innerText = `Doe R$${valorSelecionado},00`;
      inputValor.style.display = "none";
      abrirModal();
    });
  });

  // 👉 outro valor
  btnOutroValor.addEventListener("click", () => {
    valorSelecionado = null;
    tituloModal.innerText = "Digite o valor da doação";
    inputValor.style.display = "block";
    abrirModal();
  });

  // 👉 gerar QR Code
  btnGerarPix.addEventListener("click", () => {
    let valorFinal = valorSelecionado;

    if (!valorFinal) {
      let valorInput = inputValor.value.replace(',', '.');
      valorFinal = parseFloat(valorInput);
    }

    gerarPix(valorFinal);
  });

  // 👉 fechar modal
  fecharModal.addEventListener("click", fechar);
  window.addEventListener("click", (e) => {
    if (e.target === modal) fechar();
  });

  function abrirModal() {
    modal.style.display = "block";
    document.body.classList.add("no-scroll");
    document.getElementById("qrcode").innerHTML = "";

  // 👉 resetar botão copiar
  const btnCopiar = document.getElementById("btnCopiarPix");
  btnCopiar.disabled = true;
  btnCopiar.innerText = "Copiar";

  // limpar código anterior
  document.getElementById("codigoPix").value = "";
  }
  
  function fechar() {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  }

});

function gerarPix(valor) {

  if (!valor || valor <= 0 || isNaN(valor)) {
    alert("Digite um valor válido");
    return;
  }

  const chavePix = "48712800805";
  const nome = "TIAGO OLIVEIRA";
  const cidade = "SAO PAULO";

  const formatField = (id, value) => {
    let size = String(value.length).padStart(2, '0');
    return id + size + value;
  };

  const merchantAccountInfo = formatField("26",
    formatField("00", "br.gov.bcb.pix") +
    formatField("01", chavePix)
  );

  const additionalDataFieldTemplate = formatField("62",
    formatField("05", "***")
  );

  let payloadBase = "000201" +
    merchantAccountInfo +
    formatField("52", "0000") +
    formatField("53", "986") +
    formatField("54", valor.toFixed(2)) +
    formatField("58", "BR") +
    formatField("59", nome) +
    formatField("60", cidade) +
    additionalDataFieldTemplate +
    "6304";

  const payloadFinal = payloadBase + calcularCRC16(payloadBase);

  // 👉 QR Code
  const qr = document.getElementById("qrcode");
  qr.innerHTML = "";

  new QRCode(qr, {
    text: payloadFinal,
    width: 200,
    height: 200
  });

  document.getElementById("codigoPix").value = payloadFinal;
  document.getElementById("btnCopiarPix").disabled = false;
}

// 🔢 CRC16
function calcularCRC16(payload) {
  let res = 0xFFFF;
  const pol = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    res ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      res = (res << 1) ^ ((res & 0x10000) ? pol : 0);
      res &= 0xFFFF;
    }
  }

  return res.toString(16).toUpperCase().padStart(4, '0');
}

// 🚀 INIT GERAL
document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrossel();
  initPainelADM();
});

// Copia do pix
document.getElementById("btnCopiarPix").addEventListener("click", () => {
  const input = document.getElementById("codigoPix");

  input.select();
  input.setSelectionRange(0, 99999); // mobile

  navigator.clipboard.writeText(input.value);

  alert("Código PIX copiado!");
});