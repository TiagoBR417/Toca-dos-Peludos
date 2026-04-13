document.addEventListener("DOMContentLoaded", function () {
  const menuSanduiche = document.querySelector(".menu-sanduiche");
  const navLinks = document.querySelector(".links");

  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener("click", () => {
      navLinks.classList.toggle("ativo");
    });
  }

  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagemCadastro");

  if (!form) {
    console.error("Formulário de cadastro não encontrado.");
    return;
  }

  if (!mensagem) {
    console.error("Elemento de mensagem do cadastro não encontrado.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensagem.textContent = "";
    mensagem.className = "mensagem-feedback";

    const nome = document.getElementById("nomeCadastro").value.trim();
    const sobrenome = document.getElementById("sobrenomeCadastro").value.trim();
    const data_nascimento = document.getElementById("dataNascimento").value;
    const telefone = document.getElementById("telefoneCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const genero = document.getElementById("generoCadastro").value;
    const senha = document.getElementById("senhaCadastro").value.trim();
    const confirmaSenha = document.getElementById("confirmaSenhaCadastro").value.trim();

    if (senha !== confirmaSenha) {
      mensagem.textContent = "As senhas não coincidem.";
      mensagem.classList.add("erro");
      return;
    }

    const payload = {
      nome,
      sobrenome,
      data_nascimento,
      telefone,
      email,
      genero,
      senha
    };

    try {
      const response = await fetch(API_CADASTRO_URL, {
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

      mensagem.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
      mensagem.classList.add("sucesso");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1800);

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      mensagem.textContent = "Erro ao cadastrar.";
      mensagem.classList.add("erro");
    }
  });
});