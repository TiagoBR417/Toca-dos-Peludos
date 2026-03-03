const API_URL = "http://localhost:8080/api/doacoes";

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

document.addEventListener("DOMContentLoaded", carregarDoacoes);

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