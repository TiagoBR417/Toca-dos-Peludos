document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDenuncia");
  const mensagem = document.getElementById("mensagemDenuncia");
  const checkbox = document.getElementById("anonimoCheckbox");
  const campoContato = document.getElementById("contatoDenuncia");
  const inputImagem = document.getElementById("imgDenuncia");
  const labelImagem = document.getElementById("labelImgDenuncia");

  if (inputImagem && labelImagem) {
    inputImagem.addEventListener("change", (event) => {
      // Verifica se o usuário de fato selecionou algum arquivo
      if (event.target.files && event.target.files.length > 0) {
        const nomeArquivo = event.target.files[0].name;
        
        // Atualiza o texto com um ícone de "check" verde e o nome do arquivo
        labelImagem.innerHTML = `✅ ${nomeArquivo}`;
        
        // Adiciona uma classe CSS caso queira mudar a cor da borda/fundo (opcional)
        labelImagem.classList.add("arquivo-selecionado");
      } else {
        // Se o usuário abrir a janela e cancelar, volta ao estado original
        labelImagem.innerHTML = `📸 Selecionar fotos da ocorrência`;
        labelImagem.classList.remove("arquivo-selecionado");
      }
    });
  }

  if (!form || !mensagem || !checkbox || !campoContato) {
    console.error("Erro: elementos do formulário não encontrados.");
    return;
  }

  // comportamento do checkbox
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      campoContato.value = "";
      campoContato.disabled = true;
    } else {
      campoContato.disabled = false;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensagem.textContent = "";
    mensagem.className = "";

    const payload = {
      tipo: document.getElementById("tipoDenuncia").value,
      descricao: document.getElementById("descricaoDenuncia").value.trim(),
      localizacao: document.getElementById("localDenuncia").value.trim(),
      contato: campoContato.value.trim(),
      anonimo: checkbox.checked ? 1 : 0
    };

    try {
      const response = await fetch(API_DENUNCIAS_URL, {
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

      mensagem.textContent = "Denúncia enviada com sucesso!";
      mensagem.classList.add("sucesso");
      form.reset();
      campoContato.disabled = false;

    } catch (error) {
      console.error("Erro:", error);
      mensagem.textContent = "Erro ao enviar denúncia.";
      mensagem.classList.add("erro");
    }
  });
});