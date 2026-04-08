
document.addEventListener("DOMContentLoaded", function() {
  const menuSanduiche = document.querySelector('.menu-sanduiche');
  const navLinks = document.querySelector('.links');


  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener('click', () => {
      navLinks.classList.toggle('ativo');
    });
  } else {
    console.error("Erro: Não encontrei o menu ou os links no HTML.");
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
  document.getElementById("telaTelefoneCadastrado").style.display = "none";
  document.getElementById("telaCodigoSms").style.display = "block";

  travarScroll();
}

function irRedefinirEmail() {
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "block";

  travarScroll();
}

function irCodigo(){
  let campo = document.getElementById("campoEmail");

  if (campo.checkValidity() === false){
    campo.reportValidity();
    return;
  }

  document.getElementById("telaEmail").style.display = "none";
  document.getElementById("telaCodigo").style.display = "block";

  travarScroll();
}

function irCodigoSms(){
  let campo = document.getElementById("campoTelefone");

  if (campo.checkValidity() === false){
    campo.reportValidity();
    return;
  }

  document.getElementById("telaTelefoneCadastrado").style.display = "none";
  document.getElementById("telaCodigoSms").style.display = "block";

  travarScroll();
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formLogin");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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
        alert(resultado.message);
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(resultado.data));
      alert("Login realizado com sucesso!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login.");
    }
  });
});