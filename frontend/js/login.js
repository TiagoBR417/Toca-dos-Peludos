document.addEventListener("DOMContentLoaded", function () {
  const menuSanduiche = document.querySelector(".menu-sanduiche");
  const navLinks = document.querySelector(".links");

  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener("click", () => {
      navLinks.classList.toggle("ativo");
    });
  } else {
    console.error("Erro: Não encontrei o menu ou os links no HTML.");
  }

  const form = document.getElementById("formLogin");
  const mensagem = document.getElementById("mensagemLogin");

  if (form && mensagem) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      mensagem.textContent = "";
      mensagem.className = "mensagem-feedback";

      const email = document.getElementById("emailLogin").value.trim();
      const senha = document.getElementById("senhaLogin").value.trim();

      const payload = { email, senha };

      try {
        const response = await fetch(API_LOGIN_URL, {
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

        localStorage.setItem("usuarioLogado", JSON.stringify(resultado.data));
        mensagem.textContent = "Login realizado com sucesso! Redirecionando...";
        mensagem.classList.add("sucesso");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);

      } catch (error) {
        console.error("Erro ao fazer login:", error);
        mensagem.textContent = "Erro ao fazer login.";
        mensagem.classList.add("erro");
      }
    });
  }
});

function travarScroll() {
  document.body.classList.add("no-scroll");
}

function liberarScroll() {
  document.body.classList.remove("no-scroll");
}

// MODAL SENHA
function abrirRecuperação() {
  document.getElementById("modalSenha").style.display = "block";
  document.getElementById("telaEmail").style.display = "block";
  document.getElementById("telaCodigo").style.display = "none";
  document.getElementById("telaRedefinirSenha").style.display = "none";
  travarScroll();
}

function fecharRecuperacao() {
  document.getElementById("modalSenha").style.display = "none";
  liberarScroll();
}

function irCodigo() {
  let campo = document.getElementById("campoEmail");

  if (campo.checkValidity() === false) {
    campo.reportValidity();
    return;
  }

  document.getElementById("telaEmail").style.display = "none";
  document.getElementById("telaCodigo").style.display = "block";
  travarScroll();
}

function irRedefinirSenha() {
  document.getElementById("telaCodigo").style.display = "none";
  document.getElementById("telaRedefinirSenha").style.display = "block";
  travarScroll();
}

// MODAL EMAIL
function abrirTelefone() {
  document.getElementById("modalEmail").style.display = "block";
  document.getElementById("telaTelefoneCadastrado").style.display = "block";
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "none";
  travarScroll();
}

function fecharTelefone() {
  document.getElementById("modalEmail").style.display = "none";
  liberarScroll();
}

function irCodigoSms() {
  let campo = document.getElementById("campoTelefone");

  if (campo.checkValidity() === false) {
    campo.reportValidity();
    return;
  }

  document.getElementById("telaTelefoneCadastrado").style.display = "none";
  document.getElementById("telaCodigoSms").style.display = "block";
  travarScroll();
}

function irRedefinirEmail() {
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "block";
  travarScroll();
}