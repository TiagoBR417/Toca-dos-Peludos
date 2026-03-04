const API_URL = "http://localhost:8080/api/doacoes";
const API_PETS_URL = "http://localhost:8080/api/pets";
const API_EVENTOS_URL = "http://localhost:8080/api/eventos";
const API_DENUNCIAS_URL = "http://localhost:8080/api/denuncias";
const API_USUARIOS_CADASTRO_URL = "http://localhost:8080/api/usuarios/cadastro";
const API_USUARIOS_LOGIN_URL = "http://localhost:8080/api/usuarios/login";

async function enviarDoacao(valor) {
    const doacao = {
        nomeDoador: "Doador Anônimo",
        emailDoador: "anonimo@toca.com",
        valor: valor
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doacao)
        });

        if (response.ok) {
            alert('Doação registrada com sucesso!');
            carregarDoacoes(); 
        } else {
            console.error("Erro na resposta da API:", response.status);
        }
    } catch (error) {
        console.error("Erro ao enviar doação:", error);
    }
}

async function carregarDoacoes() {
    const lista = document.getElementById('listaDoacoes');
    if (!lista) return;

    try {
        const response = await fetch(API_URL);
        const doacoes = await response.json();

        lista.innerHTML = "";
        doacoes.forEach(d => {
            const li = document.createElement('li');
            const valorFormatado = (d.valor || 0).toFixed(2);
            li.textContent = `🐾 R$ ${valorFormatado} recebidos`;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar lista:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarDoacoes();
    carregarPets();
    carregarEventos();
    setupDenunciaForm();
    setupCadastroForm();
    setupLoginForm();
});

function doarValorAberto()  {
    const campoValor = document.getElementById("valorPersonalizado");

    const valorDigitado = parseFloat(campoValor.value);

    if (isNaN(valorDigitado) || valorDigitado <= 0) {
        alert("Por favor, insira um valor valido para a doacao. ");
        return;
    }

    enviarDoacao(valorDigitado);

    campoValor.value = "";
}

async function carregarPets() {
    const container = document.getElementById('listaPets');
    if (!container) return;
    try {
        const response = await fetch(API_PETS_URL);
        const pets = await response.json();
        container.innerHTML = "";
        pets.forEach(p => {
            const card = document.createElement('div');
            card.className = 'pet-card';
            const img = document.createElement('img');
            img.src = p.imagemUrl || 'https://placehold.co/200x160?text=Pet';
            img.alt = p.nome || 'Pet';
            const title = document.createElement('h3');
            title.textContent = p.nome || 'Pet';
            const meta = document.createElement('p');
            meta.textContent = `${p.tipo || ''} • ${p.raca || ''} • ${p.porte || ''}`;
            const status = document.createElement('span');
            status.className = 'status';
            status.textContent = p.status || 'DISPONIVEL';
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(meta);
            card.appendChild(status);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar pets:", error);
    }
}

async function carregarEventos() {
    const container = document.getElementById('listaEventos');
    if (!container) return;
    try {
        const response = await fetch(API_EVENTOS_URL);
        const eventos = await response.json();
        container.innerHTML = "";
        eventos.forEach(e => {
            const card = document.createElement('div');
            card.className = 'evento-card';
            const title = document.createElement('h3');
            title.textContent = e.titulo || 'Evento';
            const info = document.createElement('p');
            const data = e.data ? new Date(e.data).toLocaleDateString() : '';
            info.textContent = `${data} • ${e.local || ''}`;
            const desc = document.createElement('p');
            desc.textContent = e.descricao || '';
            card.appendChild(title);
            card.appendChild(info);
            card.appendChild(desc);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
}

function setupDenunciaForm() {
    const form = document.getElementById('formDenuncia');
    if (!form) return;
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const tipo = document.getElementById('tipoDenuncia')?.value || '';
        const descricao = document.getElementById('descricaoDenuncia')?.value || '';
        const local = document.getElementById('localDenuncia')?.value || '';
        const anonimo = document.getElementById('anonimo')?.checked || false;
        const contato = document.getElementById('contatoDenuncia')?.value || '';
        const payload = {
            descricao: tipo ? `${tipo}: ${descricao}` : descricao,
            localizacao: local,
            contato: anonimo ? '' : contato,
            anonimo: anonimo
        };
        try {
            const resp = await fetch(API_DENUNCIAS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                alert('Denúncia enviada com sucesso');
                form.reset();
            } else {
                alert('Falha ao enviar denúncia');
            }
        } catch (e) {
            console.error('Erro ao enviar denúncia:', e);
        }
    });
}

function setupCadastroForm() {
    const form = document.getElementById('formCadastro');
    if (!form) return;
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const nome = document.getElementById('nomeCadastro')?.value || '';
        const email = document.getElementById('emailCadastro')?.value || '';
        const senha = document.getElementById('senhaCadastro')?.value || '';
        const confirmar = document.getElementById('confirmaSenhaCadastro')?.value || '';
        if (!email || !senha || !nome) {
            alert('Preencha nome, e-mail e senha');
            return;
        }
        if (senha !== confirmar) {
            alert('As senhas não coincidem');
            return;
        }
        const payload = { nome, email, senha };
        try {
            const resp = await fetch(API_USUARIOS_CADASTRO_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                alert('Cadastro realizado com sucesso');
                window.location.href = 'login.html';
            } else {
                alert('Falha no cadastro');
            }
        } catch (e) {
            console.error('Erro no cadastro:', e);
        }
    });
}

function setupLoginForm() {
    const form = document.getElementById('formLogin');
    if (!form) return;
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const email = document.getElementById('emailLogin')?.value || '';
        const senha = document.getElementById('senhaLogin')?.value || '';
        if (!email || !senha) {
            alert('Informe e-mail e senha');
            return;
        }
        const payload = { email, senha };
        try {
            const resp = await fetch(API_USUARIOS_LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                alert('Login realizado');
                window.location.href = 'index.html';
            } else {
                alert('Credenciais inválidas');
            }
        } catch (e) {
            console.error('Erro no login:', e);
        }
    });
}
