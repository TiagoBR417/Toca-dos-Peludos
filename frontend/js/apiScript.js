
// CONFIGURAÇÕES E URLS DA API
const BASE_URL = "http://localhost/Toca-dos-Peludos/api"; 

const API_PETS_URL = `${BASE_URL}/pets.php`;
const API_EVENTOS_URL = `${BASE_URL}/eventos.php`;
const API_DENUNCIAS_URL = `${BASE_URL}/denuncias.php`; 
const API_USUARIOS_CADASTRO_URL = `${BASE_URL}/usuarios.php`;
const API_USUARIOS_LOGIN_URL = `${BASE_URL}/login.php`;


// INICIALIZAÇÃO DA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    verificarSessao(); // Verifica se está logado logo ao carregar a página
    carregarPets();
    carregarEventos();
    setupDenunciaForm();
    setupCadastroForm();
    setupLoginForm();
});


//exibe os pets
let todosOsPets = []; 

async function carregarPets() {
    const container = document.getElementById('listaPets');
    if (!container) return; 

    try {
        const response = await fetch(API_PETS_URL);
        if (!response.ok) throw new Error("Erro na rede");
        
        // Salva todos os pets na variável global
        todosOsPets = await response.json();
        
        // Desenha os cards na tela
        renderizarPets(todosOsPets); 
        
    } catch (error) {
        console.error("Erro ao carregar pets:", error);
    }
}

function renderizarPets(pets) {
    const container = document.getElementById('listaPets');
    container.innerHTML = ""; // Limpa a tela
    
    pets.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'card-pet';
        
        // Adaptado para usar os nomes das colunas do nosso banco de dados
        card.innerHTML = `
            <img src="${pet.imagemUrl || 'https://placehold.co/300x200?text=Sem+Foto'}" alt="${pet.nome}">
            <div class="card-pet-info">
                <h3>${pet.nome}</h3>
                <p>${pet.tipo} • ${pet.porte}</p>
                <p>${pet.raca}</p>
                <a href="#" class="link-ver-mais">Ver mais &rarr;</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Ativa o botão de filtro
document.addEventListener('DOMContentLoaded', () => {
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            const tipoSelecionado = document.getElementById('filtroTipo').value;
            
            if (tipoSelecionado === 'todos') {
                renderizarPets(todosOsPets); // Mostra tudo
            } else {
                // Filtra a lista (ex: só mostra se pet.tipo for igual a "Gato")
                const petsFiltrados = todosOsPets.filter(pet => pet.tipo === tipoSelecionado);
                renderizarPets(petsFiltrados);
            }
        });
    }
});
async function carregarEventos() {
    const container = document.getElementById('listaEventos');
    if (!container) return; // Só roda se estiver na página de Eventos
    
    try {
        const response = await fetch(API_EVENTOS_URL);
        if (!response.ok) throw new Error("Erro na rede");
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


//denuncia

//pega os valores
// const tipo = document.getElementById('tipoDenuncia').value;
// const descricao = document.getElementById('descricaoDenuncia').value;
// const local = document.getElementById('localDenuncia').value;
// const anonimo = document.getElementById('anonimo').checked;
// const contato = document.getElementById('contatoDenuncia').value;

function setupDenunciaForm() {
    const form = document.getElementById('formDenuncia');
    if (!form) return;
    
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        
        // Pegando os valores direto do HTML
        const tipo = document.getElementById('tipoDenuncia').value;
        const descricao = document.getElementById('descricaoDenuncia').value;
        const local = document.getElementById('localDenuncia').value;
        const anonimo = document.getElementById('anonimo').checked;
        const contato = document.getElementById('contatoDenuncia').value;
        
    
        if (!tipo) {
            alert("Mano, seleciona o tipo de denúncia ali em cima primeiro.");
            return;
        }
        
    
        const payload = {
            tipo: tipo,
            descricao: descricao,
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
                alert('Boa! Denúncia enviada com sucesso.');
                form.reset();
            } else {
                // Tenta ler o erro que o PHP cuspiu
                const dados = await resp.json();
                alert('Falha ao enviar denúncia: ' + (dados.erro || 'Erro na API'));
            }
        } catch (e) {
            console.error('Erro na requisição (Denúncia):', e);
            alert("Deu ruim de conectar com o servidor. Vê se o XAMPP tá rodando.");
        }
    });
}

function setupCadastroForm() {
    // Usando o ID 'form-cadastro' que configuramos no HTML
    const form = document.getElementById('form-cadastro'); 
    if (!form) return;
    
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        
        const senha = document.getElementById('senhaCadastro').value;
        const confirmaSenha = document.getElementById('confirmaSenhaCadastro').value;
        
        if (senha !== confirmaSenha) {
            alert("As senhas não coincidem. Por favor, digite novamente.");
            return;
        }

        const payload = {
            nome: document.getElementById('nomeCadastro').value,
            sobrenome: document.getElementById('sobrenomeCadastro').value,
            data_nascimento: document.getElementById('dataNascimento').value,
            telefone: document.getElementById('telefoneCadastro').value,
            email: document.getElementById('emailCadastro').value,
            genero: document.getElementById('generoCadastro').value,
            senha: senha
        };

        try {
            const resp = await fetch(API_USUARIOS_CADASTRO_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const dados = await resp.json();

            if (resp.ok) {
                alert(dados.mensagem || "Cadastro realizado com sucesso!");
                window.location.href = 'login.html';
            } else {
                alert("Erro: " + (dados.erro || "Falha no cadastro"));
            }
        } catch (e) {
            console.error('Erro no cadastro:', e);
            alert("Ocorreu um erro ao conectar com o servidor.");
        }
    });
}

function setupLoginForm() {
    const formLogin = document.getElementById('formLogin');
    if (!formLogin) return;

    formLogin.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const payload = {
            email: document.getElementById('emailLogin').value,
            senha: document.getElementById('senhaLogin').value
        };

        try {
            const resp = await fetch(API_USUARIOS_LOGIN_URL, {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const dados = await resp.json();

            if (resp.ok) { 
                alert("Bem-vindo(a), " + dados.usuario.nome + "!");
                // Salva o usuário no navegador
                localStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));
                // Vai para a Home
                window.location.href = 'index.html'; 
            } else { 
                alert("Erro: " + dados.erro);
            }
        } catch (erro) {
            console.error('Erro no login:', erro);
            alert("Ocorreu um erro ao tentar fazer login.");
        }
    });
}


// CONTROLE DE SESSÃO E CABEÇALHO
function verificarSessao() {
    const usuarioString = localStorage.getItem('usuarioLogado');
    const areaAcoes = document.querySelector('.actions');

    if (usuarioString && areaAcoes) {
        const usuario = JSON.parse(usuarioString);
        areaAcoes.innerHTML = `
            <span style="margin-right: 15px; font-weight: 600; color: #333;">Olá, ${usuario.nome}!</span>
            <button onclick="fazerLogout()" class="btn-accent" style="background-color: #e74c3c; border: none;">Sair</button>
        `;
    }
}

window.fazerLogout = function() {
    localStorage.removeItem('usuarioLogado');
    window.location.reload(); 
};

// Outras funções
function doarValorAberto()  {
    const campoValor = document.getElementById("valorPersonalizado");
    if (!campoValor) return;
    
    const valorDigitado = parseFloat(campoValor.value);
    if (isNaN(valorDigitado) || valorDigitado <= 0) {
        alert("Por favor, insira um valor válido para a doação.");
        return;
    }
    // enviarDoacao(valorDigitado); 
    campoValor.value = "";
}


let listaCompletaPets = []; // Variável para guardar os dados do banco

async function carregarPets() {
    const container = document.getElementById('listaPets');
    if (!container) return;

    try {
        const response = await fetch('http://localhost/Toca-dos-Peludos/api/pets.php');
        listaCompletaPets = await response.json();
        
        exibirPets(listaCompletaPets); // Mostra todos inicialmente
    } catch (error) {
        console.error("Erro ao carregar pets:", error);
    }
}

function exibirPets(pets) {
    const container = document.getElementById('listaPets');
    container.innerHTML = ''; 

    pets.forEach(pet => {
        container.innerHTML += `
            <div class="card-pet">
                <img src="${pet.imagemUrl || 'img/placeholder-pet.jpg'}" alt="${pet.nome}">
                <div class="card-pet-content">
                    <h3>${pet.nome}</h3>
                    <p>${pet.tipo === 'Gato' ? 'Fêmea' : 'Macho'}</p> <p>${pet.raca}</p>
                    <a href="detalhes.html?id=${pet.id}" class="link-ver-mais">Ver mais &rarr;</a>
                </div>
            </div>
        `;
    });
}

// Lógica do Filtro
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnFiltrar');
    if (btn) {
        btn.addEventListener('click', () => {
            const tipo = document.getElementById('filtroTipo').value;
            if (tipo === 'todos') {
                exibirPets(listaCompletaPets);
            } else {
                const filtrados = listaCompletaPets.filter(p => p.tipo === tipo);
                exibirPets(filtrados);
            }
        });
    }
});

// Barra de busca
const inputBusca = document.getElementById('inputBusca');

if (inputBusca) {
    inputBusca.addEventListener('input', () => {
        const termoBusca = inputBusca.value.toLowerCase(); 

        // Filtra a lista toda
        const petsFiltrados = todosOsPets.filter(pet => {
            const nomePet = pet.nome.toLowerCase();
            // verifica se o nome do 
            return nomePet.includes(termoBusca);
        });

        //carrega a lista 
        renderizarPets(petsFiltrados);
    });
}

