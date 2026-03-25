  // MODAL SENHA
function abrirRecuperação() {
  document.getElementById("modalSenha").style.display = "block";
  document.getElementById("telaEmail").style.display = "block";
  document.getElementById("telaCodigo").style.display = "none";
  document.getElementById("telaRedefinirSenha").style.display = "none";
}

function fecharRecuperacao() {
  document.getElementById("modalSenha").style.display = "none";
}

function irCodigo() {
  document.getElementById("telaEmail").style.display = "none";
  document.getElementById("telaCodigo").style.display = "block";
}

function irRedefinirSenha() {
  document.getElementById("telaCodigo").style.display = "none";
  document.getElementById("telaRedefinirSenha").style.display = "block";
}

// MODAL EMAIL
function abrirTelefone() {
  document.getElementById("modalEmail").style.display = "block";
  document.getElementById("telaTelefoneCadastrado").style.display = "block";
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "none";
}

function fecharTelefone() {
  document.getElementById("modalEmail").style.display = "none";
}

function irCodigoSms() {
  document.getElementById("telaTelefoneCadastrado").style.display = "none";
  document.getElementById("telaCodigoSms").style.display = "block";
}

function irRedefinirEmail() {
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "block";
}

function irCodigo(){
  let campo = document.getElementById("campoEmail");

  if (campo.checkValidity() === false){
    campo.reportValidity();
    return;
  }

  document.getElementById("telaEmail").style.display = "none";
  document.getElementById("telaCodigo").style.display = "block";

}

function irCodigoSms(){
  let campo = document.getElementById("campoTelefone");

  if (campo.checkValidity() === false){
    campo.reportValidity();
    return;
  }

  document.getElementById("telaTelefoneCadastrado").style.display = "none";
  document.getElementById("telaCodigoSms").style.display = "block";

}