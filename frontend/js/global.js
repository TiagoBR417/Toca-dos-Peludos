// Menu Sanduiche
document.addEventListener("DOMContentLoaded", function() {
  const menuSanduiche = document.querySelector('.menu-sanduiche');
  const navLinks = document.querySelector('.links');
 
  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener('click', () => {
      navLinks.classList.toggle('ativo');
      menuSanduiche.classList.toggle('ativo');
    });
  } else {
    console.error("Erro: Não encontrei o menu ou os links no HTML.");
  }
});

// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// LINK ATIVO AUTOMÁTICO
const links = document.querySelectorAll(".links a");

links.forEach(link => {
  link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

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