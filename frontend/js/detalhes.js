document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get("id");

  if (!petId) {
    document.getElementById("detalhesPet").innerHTML = "<p>Pet não encontrado.</p>";
    return;
  }

  await carregarDetalhesPet(petId);
  configurarFormularioAgendamento(petId);
});

async function carregarDetalhesPet(petId) {
  const container = document.getElementById("detalhesPet");

  try {
    const response = await fetch(API_PETS_URL);
    const resultado = await response.json();

    if (!resultado.success) {
      container.innerHTML = `<p>${resultado.message}</p>`;
      return;
    }

    const pet = resultado.data.find((item) => Number(item.id) === Number(petId));

    if (!pet) {
      container.innerHTML = "<p>Pet não encontrado.</p>";
      return;
    }

    const imagem = pet.imagem_url && pet.imagem_url.trim() !== ""
      ? pet.imagem_url
      : "https://placehold.co/800x500?text=Sem+Foto";

    const local = montarLocalizacao(pet.bairro, pet.cidade);

    container.innerHTML = `
      <img 
        src="${imagem}" 
        alt="${pet.nome}" 
        class="detalhes-pet-imagem"
        onerror="this.src='https://placehold.co/800x500?text=Sem+Foto'"
      >

      <div class="detalhes-pet-conteudo">
        <h1>${valorSeguro(pet.nome, "Pet sem nome")}</h1>

        <div class="detalhes-tags">
          <span>${valorSeguro(pet.tipo, "tipo não informado")}</span>
          <span>${valorSeguro(pet.porte, "porte não informado")}</span>
          <span>${valorSeguro(pet.status, "disponivel")}</span>
        </div>

        <div class="detalhes-info">
          <p><strong>Raça:</strong> ${valorSeguro(pet.raca, "Não informada")}</p>
          <p><strong>Cor:</strong> ${valorSeguro(pet.cor, "Não informada")}</p>
          <p><strong>Idade:</strong> ${valorSeguro(pet.idade, "Não informada")}</p>
          <p><strong>Local:</strong> ${local}</p>
        </div>

        <p class="detalhes-descricao">
          <strong>Descrição:</strong> ${valorSeguro(
            pet.descricao,
            "Esse pet está esperando por um novo lar cheio de amor."
          )}
        </p>
      </div>
    `;
  } catch (error) {
    console.error("Erro ao carregar detalhes do pet:", error);
    container.innerHTML = "<p>Erro ao carregar detalhes do pet.</p>";
  }
}

function configurarFormularioAgendamento(petId) {
  const form = document.getElementById("formAgendamento");
  const mensagem = document.getElementById("mensagemAgendamento");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    mensagem.textContent = "";
    mensagem.className = "mensagem-agendamento";

    const horario = document.getElementById("horarioVisita").value;
    const horarioCompleto = horario.length === 5 ? `${horario}:00` : horario;

    const payload = {
      pet_id: Number(petId),
      nome_interessado: document.getElementById("nomeInteressado").value.trim(),
      email_interessado: document.getElementById("emailInteressado").value.trim(),
      telefone_interessado: document.getElementById("telefoneInteressado").value.trim(),
      data_visita: document.getElementById("dataVisita").value,
      horario_visita: horarioCompleto,
      observacoes: document.getElementById("observacoesAgendamento").value.trim()
    };

    try {
      const response = await fetch(API_AGENDAMENTOS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resultado = await response.json();

      if (!resultado.success) {
        mensagem.textContent = resultado.message;
        mensagem.classList.add("erro");
        return;
      }

      mensagem.textContent = "Agendamento realizado com sucesso!";
      mensagem.classList.add("sucesso");
      form.reset();
    } catch (error) {
      console.error("Erro ao agendar visita:", error);
      mensagem.textContent = "Erro ao agendar visita.";
      mensagem.classList.add("erro");
    }
  });
}

function valorSeguro(valor, fallback) {
  if (valor === null || valor === undefined) return fallback;
  const texto = String(valor).trim();
  return texto !== "" ? texto : fallback;
}

function montarLocalizacao(bairro, cidade) {
  const bairroSeguro = bairro ? String(bairro).trim() : "";
  const cidadeSegura = cidade ? String(cidade).trim() : "";

  if (bairroSeguro && cidadeSegura) return `${bairroSeguro}, ${cidadeSegura}`;
  if (bairroSeguro) return bairroSeguro;
  if (cidadeSegura) return cidadeSegura;

  return "Local não informado";
}