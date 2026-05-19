// ----- Componente Header -----
class GlobalHeader extends HTMLElement {
  constructor() {
    super(); // SEMPRE PRIMEIRO
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
/* Inicio do Cabeçalho */
.nav {
  background: var(--primary);
  color: #18212f;
  position: sticky;
  top: 0;
  z-index: 20;
}
 
.nav-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  position: relative;
}
 
.nav img {
  width: 60px;
  height: 60px;
}

.nav .links {
  display: flex;
  gap: 20px;
  border-radius: 0 0 12px 12px;
}

.nav .links a {
  margin: 12px 0;
  font-size: 18px;
  color: var(--text);
  text-decoration: none;
  position: relative;
  transition: 0.3s;
}

.nav .links a:hover {
  padding-left: 5px;
}
 
.logo {
  border-radius: 12px; /* controla a curvatura */
  object-fit: cover; /* mantém proporção da imagem */
}
 
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}
 
.links a {
  position: relative;
  color: #7956a6;
  text-decoration: none;
  margin: 0 8px;
  font-weight: 600;
}
 
.links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0%;
  height: 2px;
  background-color: #7956a6;
  transition: width 0.6s ease;
}
 
.links a:hover::after {
  width: 100%;
}
 
.links a:hover {
  color: var(--accent);
}
 
.links a.active {
  color: var(--accent);
}
 
.links a.active::after {
  width: 100%;
}
 
.btn-accent {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s;
  text-decoration: none;
}
 
.btn-accent:hover {
  transform: scale(1.05);
}
 
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
 
.actions button {
  margin: 0;
}

/* Fim do Cabeçalho */
/* Inicio do Menu Sanduiche */
.menu-sanduiche {
  display: none;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  z-index: 1000;
}

.menu-sanduiche .linha {
  width: 30px;
  height: 3px;
  background-color: #333;
  border-radius: 5px;
  transition: all 0.3s ease;
}

/* ANIMAÇÃO */
.menu-sanduiche.ativo .linha:nth-child(1) {
  transform: rotate(45deg) translate(7px, 5px);
}

.menu-sanduiche.ativo .linha:nth-child(2) {
  opacity: 0;
}

.menu-sanduiche.ativo .linha:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

@media screen and (max-width: 768px) {
  .menu-sanduiche {
    display: flex;
  }

  .nav .links {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    transform: translateY(-20px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .nav .links a {
    color:#fff
  }

  .nav .links.ativo {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
}

/* Fim do Menu Sanduiche */
      </style>
      <header class="nav">
        <div class="nav-content">
          <div class="brand">
            <a href="index.html">
              <img src="img/logo-tdp.jpg" class="logo" alt="Logo Toca dos Peludos">
            </a>
            <span>Toca dos Peludos</span>
          </div>
          <nav class="links">
            <a href="index.html">Início</a>
            <a href="sobre_nos.html">Sobre</a>
            <a href="pets.html">Pets</a>
            <a href="eventos.html">Eventos</a>
            <a href="denuncias.html">Denúncias</a>
            <a href="contatos.html">Contatos</a>
          </nav>
          <div class="menu-sanduiche">
            <div class="linha"></div>
            <div class="linha"></div>
            <div class="linha"></div>
          </div>
            <div class="actions">
              <span id="areaAuth" style="display: inline-flex; gap: 10px; align-items: center;"></span>
            </div>
        </div>
      </header>
    `;
  this.setupMenuSanduiche(); // menu sanduiche
  this.applyActiveLink(); // link ativo automático
}

setupMenuSanduiche() {
    const menuSanduiche = this.shadowRoot.querySelector('.menu-sanduiche');
    const navLinks = this.shadowRoot.querySelector('.links');

    if (menuSanduiche && navLinks) {
      menuSanduiche.addEventListener('click', () => {
        navLinks.classList.toggle('ativo');
        menuSanduiche.classList.toggle('ativo');
      });
    }
  }

applyActiveLink() {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";
  const links = this.shadowRoot.querySelectorAll(".links a");
  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}
}
customElements.define('global-header', GlobalHeader);

// ----- Componente Footer -----
class GlobalFooter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
/* Começo do Rodapé */
.footer {
  width: 100%;
  background-color: var(--accent);
}

/* Container principal */
.footer #itens_footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 5% 15px;
  display: grid;
  grid-template-columns: repeat(4, auto);
  justify-content: space-between;
  align-items: start;
  gap: 40px;
}

/* Todas as colunas */
#logo_footer,
#redes_footer,
#links_footer,
#contato_footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Logo / texto */
#logo_footer {
  max-width: 260px;
  align-items: center;
  text-align: center;
}

#img_logo_footer {
  width: 70px;
  height: auto;
}

#logo_footer p {
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  max-width: 260px;
}

/* Títulos */
.footer h3 {
  color: var(--primary);
  font-size: 16px;
  margin-bottom: 8px;
}

/* Links */
.footer a,
.footer span {
  color: #fff;
  font-size: 14px;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

/* REDES SOCIAIS */
#redes_footer {
  align-items: center;
  text-align: center;
  justify-content: center;
}

#icons_redes {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
}

#icons_redes a {
  background: rgba(255,255,255,0.15);
  padding: 6px;
  border-radius: 8px;
  transition: 0.3s;
}

#icons_redes a:hover {
  background: rgba(255,255,255,0.3);
}

#icons_redes img {
  width: 26px;
  height: 26px;
  display: block;
}

#copyright {
  background-color: var(--primary);
  text-align: center;
  padding: 8px 0;
}

#copyright p {
  margin: 0;        /* REMOVE o espaço invisível */
  font-size: 13px;
  color: #222;
  font-weight: 500;
  line-height: 1.2; /* Deixa mais compacto */
}

/* Responsividade do footer do TABLET (900px) */
@media (max-width: 900px) {
  .footer #itens_footer {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  #logo_footer {
    grid-column: 1 / -1;
    max-width: 100%;
    align-items: center;
    text-align: center;
  }

  #logo_footer p {
    max-width: 520px;
  }

  #redes_footer,
  #links_footer,
  #contato_footer {
    align-items: center;
    text-align: center;
  }

  #icons_redes {
    justify-content: center;
  }
}

/* Responsividade do footer do CELULAR (600px) */
@media (max-width: 600px) {
  .footer #itens_footer {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 14px 20px 12px;
    gap: 16px;
  }

  #logo_footer,
  #redes_footer,
  #links_footer,
  #contato_footer {
    max-width: 100%;
    align-items: center;
    text-align: center;
  }

  #logo_footer p {
    max-width: 100%;
    font-size: 13px;
  }

  .footer h3 {
    font-size: 16px;
  }

  .footer a,
  .footer span,
  #copyright p {
    font-size: 13px;
  }

  #img_logo_footer {
    width: 90px;
  }

  #icons_redes {
    justify-content: center;
    gap: 10px;
  }

  #icons_redes a img {
    width: 24px;
    height: 24px;
  }

  #copyright {
    padding: 8px;
  }
}
/* Fim do Rodapé */
      </style>
      <footer class="footer">
        <div id="itens_footer">
          <div id="logo_footer">
            <img src="img/logo-tdp.jpg" class="logo" alt="Logo Toca dos Peludos" id="img_logo_footer">
            <p>
              Somos uma ONG dedicada ao resgate, cuidado e adoção responsável de animais.
              Nossa missão é dar uma segunda chance para cada peludo encontrar um lar cheio de amor.
            </p>
          </div>
          <div id="redes_footer">
            <h3>Redes Sociais</h3>
            <div id="icons_redes">
              <a href="https://www.instagram.com/toca_dos_peludos/" target="_blank" rel="noopener noreferrer">
                <img src="img/icons8-instagram-50.svg" alt="Instagram">
              </a>
              <a href="https://www.tiktok.com/@toca_dos_peludos" target="_blank" rel="noopener noreferrer">
                <img src="img/icons8-tiktok-50.svg" alt="TikTok">
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="img/icons8-whatsapp-50.svg" alt="WhatsApp">
              </a>
              <a href="https://www.facebook.com/tocadospeludos/?locale=pt_BR" target="_blank" rel="noopener noreferrer">
                <img src="img/icons8-facebook-50.svg" alt="Facebook">
              </a>
            </div>
          </div>
          <div id="links_footer">
            <h3>Links Rápidos</h3>
            <a href="pets.html">Adotar um Pet</a>
            <a href="#ajude">Fazer Doação</a>
            <a href="denuncias.html">Fazer uma denúncia</a>
            <a href="eventos.html">Eventos</a>
          </div>
          <div id="contato_footer">
            <h3>Contatos</h3>
            <a href="mailto:contato@tocadospeludos.org">contato@tocadospeludos.org</a>
            <a href="tel:+5511999999999">(11) 99999 - 9999</a>
            <span>São Paulo, SP</span>
          </div>
        </div>
        <div id="copyright">
          <p>© 2026 Toca dos Peludos. Feito com ❤️ para os animais.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('global-footer', GlobalFooter);

document.addEventListener("DOMContentLoaded", () => {

  // Atualiza ano automaticamente
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Exemplo: scroll suave ao clicar em links internos
  document.querySelectorAll('.footer a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});