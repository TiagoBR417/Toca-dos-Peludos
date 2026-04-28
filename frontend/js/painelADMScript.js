// --- FUNÇÃO PARA CARREGAR DENÚNCIAS ---
async function carregarTabelaDenunciasPainel(cabecalho, corpo) {
    // Monta o cabeçalho específico para denúncias
    cabecalho.innerHTML = `
        <th>ID</th>
        <th>Tipo</th>
        <th>Descrição</th>
        <th>Local</th>
        <th>Contato</th>
        <th>Data</th>
    `;

    try {
        const response = await fetch('http://localhost/Toca-dos-Peludos/api/denuncias.php');
        const denuncias = await response.json();
        
        corpo.innerHTML = ''; // Limpa o "Carregando..."
        
        denuncias.forEach(d => {
            const contato = d.anonimo == 1 ? '<span style="color:#e74c3c; font-weight:bold;">Anônimo</span>' : (d.contato || '-');
            const dataFormatada = new Date(d.data_denuncia).toLocaleDateString('pt-BR');
            
            corpo.innerHTML += `
                <tr>
                    <td>#${d.id}</td>
                    <td><strong>${d.tipo}</strong></td>
                    <td>${d.descricao}</td>
                    <td>${d.localizacao || '-'}</td>
                    <td>${contato}</td>
                    <td>${dataFormatada}</td>
                </tr>
            `;
        });
    } catch (e) {
        corpo.innerHTML = '<tr><td colspan="6">Erro ao buscar denúncias.</td></tr>';
    }
}

// --- FUNÇÃO PARA CARREGAR PETS ---
async function carregarTabelaPetsPainel(cabecalho, corpo) {
    // Monta o cabeçalho específico para pets
    cabecalho.innerHTML = `
        <th>ID</th>
        <th>Foto</th>
        <th>Nome</th>
        <th>Tipo</th>
        <th>Porte</th>
        <th>Status</th>
    `;

    try {
        const response = await fetch('http://localhost/Toca-dos-Peludos/api/pets.php');
        const pets = await response.json();
        
        corpo.innerHTML = ''; 
        
        pets.forEach(p => {
            // Estilo dinâmico pro status ficar bonito
            const corStatus = p.status === 'DISPONÍVEL' ? 'green' : 'orange';
            
            corpo.innerHTML += `
                <tr>
                    <td>#${p.id}</td>
                    <td><img src="${p.imagemUrl}" alt="foto" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;"></td>
                    <td><strong>${p.nome}</strong></td>
                    <td>${p.tipo}</td>
                    <td>${p.porte}</td>
                    <td><span style="color: ${corStatus}; font-weight: 600;">${p.status}</span></td>
                </tr>
            `;
        });
    } catch (e) {
        corpo.innerHTML = '<tr><td colspan="6">Erro ao buscar pets.</td></tr>';
    }
}