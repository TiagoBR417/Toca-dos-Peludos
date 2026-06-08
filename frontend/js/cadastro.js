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

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;

  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;

  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
}

//Validação de CEP

const inputCep = document.getElementById('cepCadastro');

inputCep.addEventListener('blur', async () => {
  // Pega o valor digitado e remove qualquer coisa que não seja número (como hifens)
  const cepLimpo = inputCep.value.replace(/\D/g, '');

  // Verifica se o CEP possui exatamente 8 números
  if (cepLimpo.length !== 8) {
    return; // Se não tiver 8 números, simplesmente para a execução
  }

  // Feedback visual (opcional, mas recomendado)
  inputRua.value = "Buscando...";

  try {
    // Faz a chamada para a API do ViaCEP
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    // A API retorna um objeto com "erro: true" se o CEP não existir
    if (dados.erro) {
      alert("CEP não encontrado. Verifique o número digitado.");
      limparCampos();
      return;
    }

    } catch (erro) {
    console.error("Erro ao buscar o CEP:", erro);
    alert("Erro na conexão ao buscar o CEP.");
    limparCampos();
  }
});

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

  const cpf = document.getElementById("cpfCadastro").value.trim();

  if (!validarCPF(cpf)) {
    mensagem.textContent = "CPF inválido.";
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