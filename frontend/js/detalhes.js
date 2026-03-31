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

    container.innerHTML = `
      <div class="card-detalhes-pet">
        <img src="${pet.imagem_url || "https://placehold.co/400x300?text=Sem+Foto"}" alt="${pet.nome}">
        <h1>${pet.nome}</h1>
        <p><strong>Tipo:</strong> ${pet.tipo}</p>
        <p><strong>Raça:</strong> ${pet.raca || "Não informada"}</p>
        <p><strong>Porte:</strong> ${pet.porte || "Não informado"}</p>
        <p><strong>Cor:</strong> ${pet.cor || "Não informada"}</p>
        <p><strong>Idade:</strong> ${pet.idade ?? "Não informada"}</p>
        <p><strong>Descrição:</strong> ${pet.descricao || "Sem descrição"}</p>
      </div>
    `;
  } catch (error) {
    console.error("Erro ao carregar detalhes do pet:", error);
    container.innerHTML = "<p>Erro ao carregar detalhes do pet.</p>";
  }
}

function configurarFormularioAgendamento(petId) {
  const form = document.getElementById("formAgendamento");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

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
        alert(resultado.message);
        return;
      }

      alert("Agendamento realizado com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao agendar visita:", error);
      alert("Erro ao agendar visita.");
    }
  });
}
>>>>>>> 47e002fc9bb3ea79abad500a33d59f0a4c6a8f30
