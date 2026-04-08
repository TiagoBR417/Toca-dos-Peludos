document.addEventListener("DOMContentLoaded", function () {
  const menuSanduiche = document.querySelector(".menu-sanduiche");
  const navLinks = document.querySelector(".links");

  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener("click", () => {
      navLinks.classList.toggle("ativo");
    });
  }

  const form = document.getElementById("form-cadastro");
  if (!form) {
    console.error("Formulário de cadastro não encontrado.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();
    const sobrenome = document.getElementById("sobrenomeCadastro").value.trim();
    const data_nascimento = document.getElementById("dataNascimento").value;
    const telefone = document.getElementById("telefoneCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const genero = document.getElementById("generoCadastro").value;
    const senha = document.getElementById("senhaCadastro").value.trim();
    const confirmaSenha = document.getElementById("confirmaSenhaCadastro").value.trim();

    if (senha !== confirmaSenha) {
      alert("As senhas não coincidem.");
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
        alert(resultado.message);
        return;
      }

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar.");
    }
  });
});