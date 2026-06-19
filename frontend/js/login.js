const API_RECUPERAR_SENHA_URL = `${BASE_URL}/site/recuperar_senha.php`;
const API_RECUPERAR_EMAIL_URL = `${BASE_URL}/site/recuperar_email.php`;

// ==========================================
// VARIÁVEIS DE CONTROLE DE FLUXO (ESTADO)
// ==========================================
let dadosRecuperacaoSenha = { email: "", codigo: "", novaSenha: "" };
let dadosRecuperacaoEmail = { telefone: "", codigo: "", novoEmail: "" };

// Auxiliar para exibir feedbacks dentro dos modais de forma limpa
function exibirFeedbackModal(idForm, texto, tipo) {
  const form = document.querySelector(`#${idForm}`);
  if (!form) return;
  
  let pMensagem = form.querySelector(".mensagem-feedback-modal");
  if (!pMensagem) {
    pMensagem = document.createElement("p");
    pMensagem.className = "mensagem-feedback mensagem-feedback-modal";
    form.appendChild(pMensagem);
  }
  
  pMensagem.textContent = texto;
  pMensagem.className = `mensagem-feedback mensagem-feedback-modal ${tipo}`;
}

function limparFeedbacksModais() {
  document.querySelectorAll(".mensagem-feedback-modal").forEach(el => el.remove());
}

function travarScroll() {
  document.body.classList.add("no-scroll");
}

function liberarScroll() {
  document.body.classList.remove("no-scroll");
}

// ==========================================
// FLUXO: MODAL ESQUECI SENHA
// ==========================================
function abrirRecuperação() {
  limparFeedbacksModais();
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

// Etapa 1: Enviar E-mail para receber código
async function irCodigo() {
  const campo = document.getElementById("campoEmail");
  if (!campo.checkValidity()) {
    campo.reportValidity();
    return;
  }

  dadosRecuperacaoSenha.email = campo.value.trim();
  exibirFeedbackModal("telaEmail form", "Enviando código...", "sucesso");

  try {
    const response = await fetch(API_RECUPERAR_SENHA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao: "enviar_codigo", email: dadosRecuperacaoSenha.email })
    });
    
    const resultado = await response.json();
    if (!resultado.success) {
      exibirFeedbackModal("telaEmail form", resultado.message || "E-mail não encontrado.", "erro");
      return;
    }

    document.getElementById("telaEmail").style.display = "none";
    document.getElementById("telaCodigo").style.display = "block";
    limparFeedbacksModais();
  } catch (error) {
    console.error("Erro:", error);
    exibirFeedbackModal("telaEmail form", "Erro ao conectar com o servidor.", "erro");
  }
}

// Etapa 2: Validar Código Enviado
async function irRedefinirSenha() {
  const formTela = document.querySelector("#telaCodigo form");
  const campoCodigo = formTela.querySelector("input[type='number']");
  
  if (!campoCodigo.checkValidity()) {
    campoCodigo.reportValidity();
    return;
  }

  dadosRecuperacaoSenha.codigo = campoCodigo.value.trim();

  try {
    const response = await fetch(API_RECUPERAR_SENHA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao: "validar_codigo", email: dadosRecuperacaoSenha.email, codigo: dadosRecuperacaoSenha.codigo })
    });

    const resultado = await response.json();
    if (!resultado.success) {
      exibirFeedbackModal("telaCodigo form", resultado.message || "Código inválido ou expirado.", "erro");
      return;
    }

    document.getElementById("telaCodigo").style.display = "none";
    document.getElementById("telaRedefinirSenha").style.display = "block";
    limparFeedbacksModais();
  } catch (error) {
    exibirFeedbackModal("telaCodigo form", "Erro ao validar código.", "erro");
  }
}

// Etapa 3: Enviar Nova Senha
async function finalizarRedefinirSenha() {
  const formTela = document.querySelector("#telaRedefinirSenha form");
  const inputs = formTela.querySelectorAll("input[type='password']");
  const novaSenha = inputs[0].value;
  const confirmaSenha = inputs[1].value;

  if (!inputs[0].checkValidity() || !inputs[1].checkValidity()) {
    formTela.reportValidity();
    return;
  }

  if (novaSenha !== confirmaSenha) {
    exibirFeedbackModal("telaRedefinirSenha form", "As senhas não coincidem.", "erro");
    return;
  }

  try {
    const response = await fetch(API_RECUPERAR_SENHA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "redefinir_senha",
        email: dadosRecuperacaoSenha.email,
        codigo: dadosRecuperacaoSenha.codigo,
        novaSenha: novaSenha
      })
    });

    const resultado = await response.json();
    if (!resultado.success) {
      exibirFeedbackModal("telaRedefinirSenha form", resultado.message || "Erro ao redefinir.", "erro");
      return;
    }

    exibirFeedbackModal("telaRedefinirSenha form", "Senha atualizada com sucesso! Fechando...", "sucesso");
    setTimeout(() => {
      fecharRecuperacao();
    }, 2000);
  } catch (error) {
    exibirFeedbackModal("telaRedefinirSenha form", "Erro ao atualizar senha.", "erro");
  }
}

// ==========================================
// FLUXO: MODAL ESQUECI EMAIL
// ==========================================
function abrirTelefone() {
  limparFeedbacksModais();
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

// Etapa 1: Enviar Telefone para receber SMS
async function irCodigoSms() {
  const campo = document.getElementById("campoTelefone");
  if (!campo.checkValidity()) {
    campo.reportValidity();
    return;
  }

  dadosRecuperacaoEmail.telefone = campo.value.trim();
  exibirFeedbackModal("telaTelefoneCadastrado form", "Enviando SMS...", "sucesso");

  try {
    const response = await fetch(API_RECUPERAR_EMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao: "enviar_sms", telefone: dadosRecuperacaoEmail.telefone })
    });

    const resultado = await response.json();
    if (!resultado.success) {
      exibirFeedbackModal("telaTelefoneCadastrado form", resultado.message || "Telefone não cadastrado.", "erro");
      return;
    }

    document.getElementById("telaTelefoneCadastrado").style.display = "none";
    document.getElementById("telaCodigoSms").style.display = "block";
    limparFeedbacksModais();
  } catch (error) {
    exibirFeedbackModal("telaTelefoneCadastrado form", "Erro ao enviar SMS.", "erro");
  }
}

// Etapa 2: Validar Código de SMS recebido
async function irRedefinirEmail() {
  const formTela = document.querySelector("#telaCodigoSms form");
  const campoCodigo = formTela.querySelector("input[type='number']");

  if (!campoCodigo.checkValidity()) {
    campoCodigo.reportValidity();
    return;
  }

  dadosRecuperacaoEmail.codigo = campoCodigo.value.trim();

  try {
    const response = await fetch(API_RECUPERAR_EMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao: "validar_sms", telefone: dadosRecuperacaoEmail.telefone, codigo: dadosRecuperacaoEmail.codigo })
    });

    const resultado = await response.json();
    if (!resultado.success) {
      exibirFeedbackModal("telaCodigoSms form", resultado.message || "Código SMS incorreto.", "erro");
      return;
    }

    document.getElementById("telaCodigoSms").style.display = "none";
    document.getElementById("telaRedefinirEmail").style.display = "block";
    limparFeedbacksModais();
  } catch (error) {
    exibirFeedbackModal("telaCodigoSms form", "Erro ao autenticar código SMS.", "erro");
  }
}

// Etapa 3: Alterar para o novo Email de forma definitiva
async function finalizarRedefinirEmail() {
  const formTela = document.querySelector("#telaRedefinirEmail form");
  const inputs = formTela.querySelectorAll("input[type='email']");
  const novoEmail = inputs[0].value;
  const confirmaEmail = inputs[1].value;

  if (!inputs[0].checkValidity() || !inputs[1].checkValidity()) {
    formTela.reportValidity();
    return;
  }

  if (novoEmail !== confirmaEmail) {
    exibirFeedbackModal("telaRedefinirEmail form", "Os e-mails não coincidem.", "erro");
    return;
  }

  try {
    const response = await fetch(API_RECUPERAR_EMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acao: "redefinir_email",
        telefone: dadosRecuperacaoEmail.telefone,
        codigo: dadosRecuperacaoEmail.codigo,
        novoEmail: novoEmail
      })
    });

    const resultado = await response.json();
    if (!resultado.success) {
      exibirFeedbackModal("telaRedefinirEmail form", resultado.message || "Erro ao atualizar e-mail.", "erro");
      return;
    }

    exibirFeedbackModal("telaRedefinirEmail form", "E-mail redefinido com sucesso! Fechando...", "sucesso");
    setTimeout(() => {
      fecharTelefone();
    }, 2000);
  } catch (error) {
    exibirFeedbackModal("telaRedefinirEmail form", "Erro ao conectar e redefinir o e-mail.", "erro");
  }
}

// ==========================================
// CONFIGURAÇÃO DOS EVENTOS DE SUBMIT DO HTML
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const btnFinalizarSenha = document.querySelector("#telaRedefinirSenha button");
  if (btnFinalizarSenha) {
    btnFinalizarSenha.setAttribute("onclick", "finalizarRedefinirSenha()");
  }

  const btnFinalizarEmail = document.querySelector("#telaRedefinirEmail button");
  if (btnFinalizarEmail) {
    btnFinalizarEmail.setAttribute("onclick", "finalizarRedefinirEmail()");
  }

  // INTERCEPTADOR DO FORMULÁRIO DE LOGIN REAL (Adicionado para corrigir o botão travado)
  const formLogin = document.getElementById("formLogin");
  const mensagemLogin = document.getElementById("mensagemLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (mensagemLogin) {
        mensagemLogin.textContent = "Autenticando...";
        mensagemLogin.className = "mensagem-feedback";
      }

      const email = document.getElementById("emailLogin").value.trim();
      const senha = document.getElementById("senhaLogin").value;

      try {
        const response = await fetch(`${BASE_URL}/site/login.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        });

        const resultado = await response.json();

        if (resultado.success) {
          if (mensagemLogin) {
            mensagemLogin.textContent = "Login realizado com sucesso! Redirecionando...";
            mensagemLogin.className = "mensagem-feedback sucesso";
          }
          
          // Armazena a sessão completa vinda da API
          localStorage.setItem("usuarioLogado", JSON.stringify(resultado.data));

          // Redireciona de acordo com o nível de acesso
          setTimeout(() => {
            if (resultado.data.tipo === "admin") {
              window.location.href = "painel_admin.html";
            } else {
              window.location.href = "perfil.html";
            }
          }, 1500);
        } else {
          if (mensagemLogin) {
            mensagemLogin.textContent = resultado.message || "Credenciais inválidas.";
            mensagemLogin.className = "mensagem-feedback erro";
          }
        }
      } catch (error) {
        console.error("Erro na requisição de login:", error);
        if (mensagemLogin) {
          mensagemLogin.textContent = "Erro de comunicação com o servidor.";
          mensagemLogin.className = "mensagem-feedback erro";
        }
      }
    });
  }
});