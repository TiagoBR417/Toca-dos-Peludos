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
  
  