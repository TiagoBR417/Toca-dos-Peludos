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
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
 
.nav-content {
  max-width: 1200px;
  margin: auto;
  padding: 5px 24px;
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
  gap: 27px;
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
  height: 60px; /* altura fixa */
  transition: transform 0.3s ease; /* animação suave */
}
.logo:hover {
  transform: rotate(-3deg) scale(1.03);
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
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(106,27,154,0.2);
}
 
.btn-accent:hover {
  transform: translateY(-2px);
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
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #744ea3, #7e57c2, #6A1B9A);
  box-shadow: 0 -10px 40px rgba(106,27, 154, 0.25);
  background-size: 300% 300%;
  animation: footerGradient 18s ease infinite;
}
      
@keyframes footerGradient {
  0% {background-position: 50% 0%;}
  50% {background-position: 100% 100%;}
  100% {background-position: 50% 0%;}
}
      
@keyframes blobMove1 {
  0% {transform: translate(0, 0);}
  50% {transform: translate(-40px, 30px);}
  100% {transform: translate(0, 0);}
}
      
@keyframes blobMove2 {
  0% {transform: translate(0, 0);}
  50% {transform: translate(50px, -20px);}
  100% {transform: translate(0, 0);}
}
      
.footer * {
  transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease;
}
      
.footer::before,
.footer::after {
  content: '';
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  pointer-events: none;
}
      
.footer::before {
  background: #ffffff;
  top: -180px;
  right: -120px;
  animation: blobMove1 18s ease-in-out infinite;
}
      
.footer::after {
  background: #ffcc33;
  bottom: -180px;
  left: -120px;
  animation: blobMove2 22s ease-in-out infinite;
}
      
/* Container principal */
.footer #itens_footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px 5% 25px;
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1fr 1fr;
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
  gap: 16px;
}
      
/* Logo / texto */
#logo_footer {
  max-width: 260px;
  align-items: center;
  text-align: center;
  gap: 14px;
  padding-top: 8px;
}
      
.logo {
  border-radius: 12px;
  object-fit: cover;
}
      
#img_logo_footer {
  width: 110px;
  height: auto;
}
      
#logo_footer p {
  color: #fff;
  font-size: 15px;
  line-height: 1.7;
  opacity: 0.9;
  max-width: 230px;
  font-weight: 400;
}
      
/* Títulos */
.footer h3 {
  color: var(--primary);
  font-size: 20px;
  letter-spacing: -0.3px;
  font-weight: 700;
  margin-bottom: 8px;
}
      
/* Links */
.footer a,
.footer span {
  color: #fff;
  font-size: 14px;
  text-decoration: none;
}
      
#links_footer a {
  transition: 0.3s ease;
  display: inline-block;
  position: relative;
}
      
#links_footer a:hover {
  transform: translateX(4px);
}
      
.footer a:hover {
  text-decoration: underline;
}
      
/* REDES SOCIAIS */
#redes_footer {
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
  gap: 24px;
}
      
#icons_redes {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex-wrap: nowrap;
}
      
#icons_redes a {
  width: 45px;
  height: 45px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.08), 0 8px 20px rgba(0,0,0,0.12);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  transition: all ease 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
      
#icons_redes a:hover {
  transform: translateY(-6px) scale(1.05);
  background: rgba(255,255,255,0.18);
  box-shadow: 0 18px 30px rgba(0,0,0,0.18);
}
      
#icons_redes img {
  width: 35px;
  height: 35px;
  display: block;
}
      
/* CONTATOS */
#contato_footer a {
  transition: 0.3s ease;
  display: inline-block;
  position: relative;
}
      
#contato_footer a:hover {
  transform: translateX(4px);
}
      
#copyright {
  background: #ffC93C;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 18px;
}
      
#copyright p {
  margin: 0;        /* REMOVE o espaço invisível */
  font-size: 13px;
  color: #222;
  font-weight: 500;
  line-height: 1.2; /* Deixa mais compacto */
  gap: 6px;
  align-items: center;
  justify-content: center;
  display: flex;
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