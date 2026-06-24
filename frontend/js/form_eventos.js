document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("evento_id");
  const nomeEventoSpan = document.getElementById("nomeEventoSelecionado");
  const mensagem = document.getElementById("mensagemFormulario");

  preencherDadosAutomaticos({
    nome: "nome",
    email: "email",
    telefone: "telefone"
  });

  if (eventoId) {
    document.getElementById("eventoId").value = eventoId;

    try {
      const response = await fetch(API_EVENTOS_URL);
      const resultado = await response.json();

      if (resultado.success) {
        const evento = resultado.data.find(item => Number(item.id) === Number(eventoId));

        if (evento && nomeEventoSpan) {
          nomeEventoSpan.textContent = evento.titulo;
        } else if (nomeEventoSpan) {
          nomeEventoSpan.textContent = "Evento não encontrado";
        }
      } else if (nomeEventoSpan) {
        nomeEventoSpan.textContent = "Evento não encontrado";
      }
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      if (nomeEventoSpan) {
        nomeEventoSpan.textContent = "Erro ao carregar evento";
      }
    }
  }

  const form = document.getElementById("formEventos");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (mensagem) {
      mensagem.textContent = "";
      mensagem.className = "";
    }

    const usuario = verificarUsuarioLogado();
    if (!usuario) {
      mensagem.textContent = "Você precisa estar logado para se inscrever neste evento.";
      mensagem.className = "erro";
      return;
    }

    const eventoId = document.getElementById("eventoId").value;

    if (!verificarLimiteEnvios(`evento_${eventoId}`, 1)) {
      mensagem.textContent = "Você já está inscrito neste evento.";
      mensagem.className = "erro";
      return;
    }

    const payload = {
      evento_id: Number(document.getElementById("eventoId").value),
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      quantidade_pessoas: Number(document.getElementById("quantidadePessoas").value),
      observacoes: document.getElementById("observacoes").value.trim()
    };

    if (!payload.evento_id) {
      if (mensagem) {
        mensagem.textContent = "Evento não identificado.";
        mensagem.classList.add("erro");
      } else {
        alert("Evento não identificado.");
      }
      return;
    }

    try {
      const response = await fetch(API_INSCRICOES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", "Authorization": `Bearer ${usuario.token}`
        },
        body: JSON.stringify(payload)
      });

      const resultado = await response.json();

      if (!resultado.success) {
        if (mensagem) {
          mensagem.textContent = resultado.message;
          mensagem.classList.add("erro");
        } else {
          alert(resultado.message);
        }
        return;
      }

      registrarEnvioSucesso(`evento_${eventoId}`);

      if (mensagem) {
        mensagem.textContent = "Inscrição realizada com sucesso! Confirmação enviada por e-mail.";
        mensagem.classList.add("sucesso");
      } else {
        alert("Inscrição realizada com sucesso!");
      }

      form.reset();
      document.getElementById("quantidadePessoas").value = 1;

      setTimeout(() => {
        window.location.href = "eventos.html";
      }, 1500);
    } catch (error) {
      console.error("Erro ao enviar inscrição:", error);

      if (mensagem) {
        mensagem.textContent = "Erro ao enviar inscrição.";
        mensagem.classList.add("erro");
      } else {
        alert("Erro ao enviar inscrição.");
      }
    }
  });
});