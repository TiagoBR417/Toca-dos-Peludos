document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    // Se não estiver logado, manda para o login
    if (!usuarioLogado || !usuarioLogado.token) {
        window.location.href = "login.html";
        return;
    }

    // Preenche a caixa de Informações do Utilizador
    document.getElementById("infoUsuario").innerHTML = `
        <h3 style="margin-top: 0; color: #333;">${usuarioLogado.nome} ${usuarioLogado.sobrenome || ''}</h3>
        <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${usuarioLogado.email}</p>
        <p style="color: #666; margin: 0;"><strong>Telefone:</strong> ${usuarioLogado.telefone || 'Não informado'}</p>
    `;

    try {
        
        const response = await fetch(`${BASE_URL}/site/perfil.php`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${usuarioLogado.token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "login.html";
            return;
        }

        const resultado = await response.json();

        if (resultado.success) {
            renderizarVisitas(resultado.data.visitas);
            renderizarEventos(resultado.data.eventos);
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
});

function renderizarVisitas(visitas) {
    const div = document.getElementById("listaVisitas");
    if (!visitas || visitas.length === 0) {
        div.innerHTML = "<p>Você ainda não agendou nenhuma visita.</p>";
        return;
    }

    let html = `<table class="admin-table" style="width: 100%; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; border-collapse: collapse;">
                <tr style="background: #f5f5f5; text-align: left;">
                    <th style="padding: 12px;">Pet</th>
                    <th style="padding: 12px;">Data</th>
                    <th style="padding: 12px;">Horário</th>
                    <th style="padding: 12px;">Status</th>
                </tr>`;
                
    visitas.forEach(v => {
        const dataFormatada = new Date(v.data_visita).toLocaleDateString('pt-BR');
        let corStatus = v.status === 'agendado' ? 'orange' : (v.status === 'confirmada' ? 'green' : 'red');
        
        html += `<tr>
                    <td style="padding: 12px; border-top: 1px solid #eee;"><strong>${v.nome_pet}</strong></td>
                    <td style="padding: 12px; border-top: 1px solid #eee;">${dataFormatada}</td>
                    <td style="padding: 12px; border-top: 1px solid #eee;">${v.horario_visita}</td>
                    <td style="padding: 12px; border-top: 1px solid #eee; color: ${corStatus}; font-weight: bold; text-transform: capitalize;">${v.status}</td>
                 </tr>`;
    });
    div.innerHTML = html + "</table>";
}

function renderizarEventos(eventos) {
    const div = document.getElementById("listaEventos");
    if (!eventos || eventos.length === 0) {
        div.innerHTML = "<p>Você ainda não se inscreveu em nenhum evento.</p>";
        return;
    }

    let html = `<table class="admin-table" style="width: 100%; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; border-collapse: collapse;">
                <tr style="background: #f5f5f5; text-align: left;">
                    <th style="padding: 12px;">Evento</th>
                    <th style="padding: 12px;">Data</th>
                    <th style="padding: 12px;">Qtd. Pessoas</th>
                    <th style="padding: 12px;">Status</th>
                </tr>`;
                
    eventos.forEach(e => {
        
        const dataObj = new Date(e.data_evento);
        const dataFormatada = `${String(dataObj.getUTCDate()).padStart(2, '0')}/${String(dataObj.getUTCMonth() + 1).padStart(2, '0')}/${dataObj.getUTCFullYear()}`;
        
        let corStatus = e.status === 'confirmada' ? 'green' : (e.status === 'cancelada' ? 'red' : 'orange');

        html += `<tr>
                    <td style="padding: 12px; border-top: 1px solid #eee;"><strong>${e.evento_nome}</strong></td>
                    <td style="padding: 12px; border-top: 1px solid #eee;">${dataFormatada}</td>
                    <td style="padding: 12px; border-top: 1px solid #eee;">${e.quantidade_pessoas}</td>
                    <td style="padding: 12px; border-top: 1px solid #eee; color: ${corStatus}; font-weight: bold; text-transform: capitalize;">${e.status}</td>
                 </tr>`;
    });
    div.innerHTML = html + "</table>";
}