document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDenuncia");
  const mensagem = document.getElementById("mensagemDenuncia");
  const checkbox = document.getElementById("anonimoCheckbox");
  const campoContato = document.getElementById("contatoDenuncia");
  const inputImagem = document.getElementById("imgDenuncia");
  const labelImagem = document.getElementById("labelImgDenuncia");

  if (inputImagem && labelImagem) {
    inputImagem.addEventListener("change", (event) => {
      if (event.target.files && event.target.files.length > 0) {
        const nomeArquivo = event.target.files[0].name;
        labelImagem.innerHTML = `✅ ${nomeArquivo}`;
        labelImagem.classList.add("arquivo-selecionado");
      } else {
        labelImagem.innerHTML = `📸 Selecionar fotos da ocorrência`;
        labelImagem.classList.remove("arquivo-selecionado");
      }
    });
  }

  if (!form || !mensagem || !checkbox || !campoContato) {
    console.error("Erro: elementos do formulário não encontrados.");
    return;
  }

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

    if (!inputImagem.files || inputImagem.files.length === 0) {
        mensagem.textContent = "Por favor, selecione pelo menos uma foto da ocorrência.";
        mensagem.className = "erro";
        return;
    }

    mensagem.textContent = "Processando envio...";
    mensagem.className = "processando";

    const formData = new FormData();
    formData.append('tipo', document.getElementById("tipoDenuncia").value);
    formData.append('descricao', document.getElementById("descricaoDenuncia").value.trim());
    formData.append('localizacao', document.getElementById("localDenuncia").value.trim());
    formData.append('anonimo', checkbox.checked ? 1 : 0);
    formData.append('contato', campoContato.value.trim());
    formData.append('imagem_ocorrencia', inputImagem.files[0]);

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const headers = {};
    if (usuarioLogado && usuarioLogado.token) {
        headers["Authorization"] = `Bearer ${usuarioLogado.token}`;
    }

    // Variável para guardar a resposta do servidor antes de tentar converter para JSON
    let respostaBruta = "";

    try {
      const response = await fetch(API_DENUNCIAS_URL, {
        method: "POST",
        headers: headers,
        body: formData
      });

      // Captura como texto puro primeiro
      respostaBruta = await response.text();
      
      // Tenta converter para objeto
      const resultado = JSON.parse(respostaBruta);

      if (!resultado.success) {
        mensagem.textContent = resultado.message || "Erro ao processar denúncia.";
        mensagem.className = "erro";
        return;
      }

      mensagem.textContent = "Denúncia cadastrada com sucesso!";
      mensagem.className = "sucesso";
      form.reset();
      labelImagem.innerHTML = `📸 Selecionar fotos da ocorrência`;
      labelImagem.classList.remove("arquivo-selecionado");
      campoContato.disabled = false;

    } catch (error) {
      console.error("Erro detalhado:", error);
      
      // Se a resposta contiver estruturas de erro do PHP, exibe no ecrã
      if (respostaBruta.includes("<br />") || respostaBruta.includes("Fatal error") || respostaBruta.includes("Stack trace")) {
        const erroLimpo = respostaBruta.replace(/<[^>]*>/g, '');
        alert("O PHP quebrou! Erro retornado pelo servidor:\n\n" + erroLimpo);
      } else {
        mensagem.textContent = "Erro crítico de comunicação com o servidor.";
        mensagem.className = "erro";
      }
    }
  });
});