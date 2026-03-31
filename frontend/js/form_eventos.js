<<<<<<< HEAD
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
  
  
=======
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("evento_id");

  if (eventoId) {
    document.getElementById("eventoId").value = eventoId;
  }

  const form = document.getElementById("formEventos");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      evento_id: Number(document.getElementById("eventoId").value),
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      quantidade_pessoas: Number(document.getElementById("quantidadePessoas").value),
      observacoes: document.getElementById("observacoes").value.trim()
    };

    if (!payload.evento_id) {
      alert("Evento não identificado.");
      return;
    }

    try {
      const response = await fetch(API_INSCRICOES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resultado = await response.json();

      if (!resultado.success) {
        alert(resultado.message);
        return;
      }

      alert("Inscrição realizada com sucesso!");
      form.reset();
      window.location.href = "eventos.html";
    } catch (error) {
      console.error("Erro ao enviar inscrição:", error);
      alert("Erro ao enviar inscrição.");
    }
  });
});
>>>>>>> 47e002fc9bb3ea79abad500a33d59f0a4c6a8f30
