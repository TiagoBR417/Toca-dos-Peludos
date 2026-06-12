document.addEventListener("DOMContentLoaded", () => {
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

  // --- FUNÇÕES DE VALIDAÇÃO ---
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
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    return resto === parseInt(cpf.substring(10, 11));
  }

  function validarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    return /^[0-9]{8}$/.test(cep);
  }

  async function cepExiste(cep) {
    cep = cep.replace(/\D/g, '');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      return !data.erro;
    } catch {
      return false;
    }
  }

  // --- EVENTO BLUR DO CEP (BUSCA AUTOMÁTICA) ---
  const cepInput = document.getElementById("cepCadastro");
  if (cepInput) {
    cepInput.addEventListener("blur", async (e) => {
      let cepValor = e.target.value.replace(/\D/g, '');
      
      if (cepValor.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepValor}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            // Preenche os inputs de endereço mapeados do HTML
            document.getElementById("enderecoCadastro").value = data.logradouro || '';
            document.getElementById("cidadeCadastro").value = data.localidade || '';
            document.getElementById("estadoCadastro").value = data.uf || '';
            
            // Move o cursor diretamente para o campo número
            document.getElementById("numeroCadastro").focus();
          } else {
            mensagem.textContent = "CEP não encontrado.";
            mensagem.className = "mensagem-feedback erro";
          }
        } catch (error) {
          console.error("Erro ao buscar CEP no ViaCEP:", error);
        }
      }
    });
  }

  // --- EVENTO SUBMIT DO FORMULÁRIO ---
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
    
    const cep = document.getElementById("cepCadastro").value.trim();
    const endereco = document.getElementById("enderecoCadastro").value.trim();
    const numero = document.getElementById("numeroCadastro").value.trim();
    const complemento = document.getElementById("complementoCadastro").value.trim();
    const cidade = document.getElementById("cidadeCadastro").value.trim();
    const estado = document.getElementById("estadoCadastro").value.trim();

    if (senha !== confirmaSenha) {
      mensagem.textContent = "As senhas não coincidem.";
      mensagem.className = "mensagem-feedback erro";
      return;
    }

    const cpf = document.getElementById("cpfCadastro").value.trim();
    if (!validarCPF(cpf)) {
      mensagem.textContent = "CPF inválido.";
      mensagem.className = "mensagem-feedback erro";
      return;
    }

    if (!validarCEP(cep)) {
      mensagem.textContent = "CEP inválido.";
      mensagem.className = "mensagem-feedback erro";
      return;
    }

    const cepValido = await cepExiste(cep);
    if (!cepValido) {
      mensagem.textContent = "CEP não encontrado.";
      mensagem.className = "mensagem-feedback erro";
      return;
    }

    const payload = {
      nome,
      sobrenome,
      data_nascimento,
      telefone,
      email,
      genero,
      senha,
      cpf,
      cep,
      endereco,
      numero,
      complemento,
      cidade,
      estado
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
        mensagem.className = "mensagem-feedback erro";
        return;
      }

      mensagem.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
      mensagem.className = "mensagem-feedback sucesso";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1800);

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      mensagem.textContent = "Erro ao cadastrar.";
      mensagem.className = "mensagem-feedback erro";
    }
  });
});