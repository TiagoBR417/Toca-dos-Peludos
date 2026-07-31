const navItems = document.querySelectorAll('.nav-links li');
const dashboardContent = document.getElementById('dashboard-content');
const dashboards = {

  pets: {
    graficos: `
      <h1>Dashboard Pets - Gráficos</h1>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>❤️ Status dos pets</h3>
          <div id="statusPets"></div>
        </div>
        <div class="chart-card">
          <h3>🐶 Espécies e portes</h3>
          <div id="portesPets"></div>
        </div>
        <div class="chart-card">
          <h3>🎂 Faixa Etária</h3>
          <div id="idadePets"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Pets - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Gerenciar Cadastro de Pets</h2>
        <button class="btn-painel" onclick="abrirModalCriarPet()">➕ Novo Pet</button>
      </div>
      <div id="container-tabela-pets"></div>
    `
  },
  eventos: {
    graficos: `
      <h1>Dashboard Eventos - Gráficos</h1>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>🎉 Conversão</h3>
          <div id="conversaoEventos"></div>
        </div>
        <div class="chart-card">
          <h3>💰 Arrecadação</h3>
          <div id="arrecadacaoEventos"></div>
        </div>
        <div class="chart-card">
          <h3>👥 Participação</h3>
          <div id="participacaoEventos"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Eventos - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📅 Gerenciar Agenda de Eventos</h2>
        <button class="btn-painel" onclick="abrirModalCriarEvento()">➕ Novo Evento</button>
      </div>
      <div id="container-tabela-eventos"></div>
    `
  },
denuncias: {
    graficos: `
      <h1>Dashboard Denúncias - Gráficos</h1>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>🚨 Denúncias por tipo</h3>
          <div id="denunciasTipo"></div>
        </div>
        <div class="chart-card">
          <h3>📋 Status</h3>
          <div id="statusDenuncias"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Denúncias - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Tratamento de Ocorrências</h2>
      </div>
      <div id="container-tabela-denuncias"></div>
    `
  },
inscricoes: {
    graficos: `
      <h1>Dashboard Inscrições - Gráficos</h1>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>📝 Inscrições por período</h3>
          <div id="inscricoesPeriodo"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Inscrições - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Gerenciar Participantes</h2>
      </div>
      <div id="container-tabela-inscricoes"></div>
    `
  },
agendamentos: {
    graficos: `
      <h1>Dashboard Agendamentos - Gráficos</h1>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>📅 Agendamentos por Mês</h3>
          <div id="agendamentosMes"></div>
        </div>
        <div class="chart-card">
          <h3>⏰ Fluxo de agendamentos por horário</h3>
          <div id="horariosMovimentados"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Agendamentos - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Controle de Visitas</h2>
      </div>
      <div id="container-tabela-agendamentos"></div>
    `
  },
  doacoes: {
    graficos: `
      <h1>Dashboard Doações - Gráficos</h1>
      <div class="charts-grid">
        <div class="kpi-card">
          <h3>💰 Total Arrecadado</h3>
          <span>R$ 48.750,00</span>
          <p>+18% em relação ao mês anterior</p>
        </div>
        <div class="chart-card">
          <h3>📈 Doações por mês</h3>
          <div id="doacoesMes"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Doações - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Histórico de Transações</h2>
      </div>
      <div id="container-tabela-doacoes"></div>
    `
  },
usuarios: {
    graficos: `
      <h1>Dashboard Usuários - Gráficos</h1>
      <div class="charts-grid">
        <div class="kpi-card">
          <h3>🔥 Usuários Ativos</h3>
          <span id="kpiUsuariosAtivos">0</span>
        </div>
        <div class="chart-card">
          <h3>👥 Crescimento (Novos)</h3>
          <div id="crescimentoUsuarios"></div>
        </div>
        <div class="chart-card">
          <h3>➗ Distribuição</h3>
          <div id="distribuicaoPerfis"></div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Usuários - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Controle de Acessos</h2>
      </div>
      <div id="container-tabela-usuarios"></div>
    `
  },
  configuracoes: {
    graficos: `
      <h1>Dashboard Sistema - Gráficos</h1>
      <div class="charts-grid">
        <div class="chart-card">
          <h3>⚙️ Uso do sistema</h3>
          <div id="usoSistema"></div>
        </div>
        <div class="chart-card">
          <h3>🚀 Performance</h3>
          <div id="performanceSistema"></div>
        </div>
        <div class="chart-card">
          <h3>🛠️ Logs de ações</h3>
          <div class="timeline">
            <div class="timeline-item">
              <span class="time">08:15</span>
              <div class="content">
                <h4>Login administrativo</h4>
                <p>Administrador acessou o sistema.</p>
              </div>
            </div>
            <div class="timeline-item">
              <span class="time">09:40</span>
              <div class="content">
                <h4>Nova adoção registrada</h4>
                <p>Pet "Thor" foi adotado.</p>
              </div>
            </div>
            <div class="timeline-item">
              <span class="time">11:10</span>
              <div class="content">
                <h4>Nova denúncia</h4>
                <p>Denúncia de abandono cadastrada.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-card">
          <h3>🔗 Integrações</h3>
          <div id="integracoesAtivas"></div>
          <div class="integracoes-grid">
            <div class="integracao-card">
              <h3>WhatsApp</h3>
              <p>Status: <strong>Ativo</strong></p>
            </div>
            <div class="integracao-card">
              <h3>E-mail</h3>
              <p>Status: <strong>Ativo</strong></p>
            </div>
          </div>
        </div>
      </div>
    `,
    tabelas: `
      <h1>Dashboard Sistema - Gerenciamento</h1>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 15px;">
        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; color: #1e293b;">📋 Registros do Sistema</h2>
      </div>
      <div id="container-tabela-configuracoes"></div>
    `
  }
};

// Inicialização da página padrão (Pets > Gráficos)
dashboardContent.innerHTML = dashboards.pets.graficos;
renderPetsCharts();
document.getElementById('menu-pets').classList.add('open');

// Gerenciador de cliques nos Menus Principais que contêm submenus
document.querySelectorAll('.has-submenu .menu-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    const parent = toggle.parentElement;
    
    // Fecha os outros submenus abertos
    document.querySelectorAll('.has-submenu').forEach(menu => {
      if (menu !== parent) menu.classList.remove('open');
    });

    // Alterna a abertura do menu clicado
    parent.classList.toggle('open');
    
    // Ao clicar no título do menu, ativa automaticamente a primeira opção interna (Gráficos)
    if(parent.classList.contains('open')) {
      const primeiroSubitem = parent.querySelector('.submenu li');
      primeiroSubitem.click();
    }
  });
});

// Seletor geral de cliques para renderização do conteúdo dos submenus
document.querySelectorAll('.submenu li[data-dashboard]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();

    // Remove a classe active de absolutamente todos os botões
    document.querySelectorAll('.submenu li').forEach(el => el.classList.remove('active'));
    
    // Adiciona classe ativa no item clicado
    item.classList.add('active');

    const dashboard = item.dataset.dashboard;
    const view = item.dataset.view;

    // Limpa o dashboard atual
    dashboardContent.replaceChildren();

    // Lógica de Renderização Dinâmica e Inteligente
    if (view && dashboards[dashboard]) {
      // Carrega o esqueleto HTML (Gráfico ou Tabela)
      dashboardContent.innerHTML = dashboards[dashboard][view];
      
      // Se a aba for Gráficos, chama a função de renderização correspondente
      if (view === 'graficos') {
        if (dashboard === 'pets') renderPetsCharts();
        else if (dashboard === 'eventos') renderEventsCharts();
        else if (dashboard === 'denuncias') renderReportsCharts();
        else if (dashboard === 'inscricoes') renderRegistrationsCharts();
        else if (dashboard === 'agendamentos') renderAppointmentsCharts();
        else if (dashboard === 'doacoes') renderDonationsCharts();
        else if (dashboard === 'usuarios') renderUsersCharts();
        else if (dashboard === 'configuracoes') renderSettingsCharts();
      } 
      // Se a aba for Tabelas, carrega os dados da API para o container correspondente
      else if (view === 'tabelas' && typeof carregarDadosTabelaDashboard === 'function') {
        carregarDadosTabelaDashboard(dashboard, `container-tabela-${dashboard}`);
      }
    }
  });
});

// GRÁFICO DE PETS
// GRÁFICO DE PETS
async function renderPetsCharts() {
    try {
        // CORREÇÃO: Atualizado para o nome correto do seu arquivo PHP
        const response = await fetch(`${BASE_URL}/admin/dashboard_status_pets.php`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const resultado = await response.json();
        
        if(!resultado.success) return;
        
        const dados = resultado.data;

        // 1. PETS: Status dos pets (Dinâmico)
        const statusLabels = dados.status.map(item => {
          let label = item.status.replace(/_/g, ' ');
          return label.charAt(0).toUpperCase() + label.slice(1);
        });
        const statusSeries = dados.status.map(item => Number(item.quantidade));
        
        new ApexCharts(document.querySelector("#statusPets"), {
            chart: {type: 'donut', height: 300},
            series: statusSeries,
            labels: statusLabels,
            colors: ['#4CAF50', '#FFC107', '#2196F3', '#9C27B0']
        }).render();

        // 2. PETS: Espécies e portes (Dinâmico)
        let pequeno = [0, 0]; // Index 0: Cachorro, Index 1: Gato
        let medio = [0, 0];
        let grande = [0, 0];

        dados.portes.forEach(item => {
            let tipoIdx = item.tipo.toLowerCase() === 'cachorro' ? 0 : 1;
            let qtd = Number(item.quantidade);
            
            if(item.porte === 'pequeno') pequeno[tipoIdx] = qtd;
            else if(item.porte === 'medio') medio[tipoIdx] = qtd;
            else if(item.porte === 'grande') grande[tipoIdx] = qtd;
        });

        new ApexCharts(document.querySelector("#portesPets"), {
            chart: {type: 'bar', stacked: true, height: 300},
            series: [
                {name: 'Pequeno', data: pequeno}, 
                {name: 'Médio', data: medio}, 
                {name: 'Grande', data: grande}
            ],
            xaxis: {categories: ['Cachorros', 'Gatos']},
            colors: ['#7956a6', '#f4b400', '#4CAF50']
        }).render();

        // 3. PETS: Idade Média/Faixa Etária (Dinâmico)
        const idades = dados.idades;
        new ApexCharts(document.querySelector("#idadePets"), {
            chart: {type: 'bar', height: 300, toolbar: {show: false}},
            series: [{name: 'Quantidade', data: [Number(idades.filhote), Number(idades.adulto), Number(idades.idoso)]}],
            xaxis: {categories: ['Filhote (até 1)', 'Adulto (2-7)', 'Idoso (8+)'], title: {text: 'Faixa etária em Anos'}},
            yaxis: {title: {text: 'Quantidade de pets'}},
            plotOptions: {bar: {borderRadius: 6, columnWidth: '55%', distributed: true}},
            colors: ['#4CAF50', '#FFC107', '#7956A6'],
            dataLabels: {enabled: false},
            grid: {borderColor: '#e0e0e0'}
        }).render();

    } catch (e) {
        console.error("Erro ao carregar gráficos dinâmicos de pets: ", e);
    }
}
// GRÁFICO DOS EVENTOS
function renderEventsCharts() {

  // EVENTOS: Participação em eventos
  const participacaoEventos = new ApexCharts(document.querySelector("#participacaoEventos"), {

    chart: {type: 'bar', height: 300},
    series: [{name: 'Participantes', data: [120, 95, 150, 80]}],
    xaxis: {categories: ['Feira de Adoção', 'Campanha Solidária', 'Mutirão Pet', 'Evento Beneficente']},
    colors: ['#7956A6'], 
    plotOptions: {bar: {borderRadius: 6, columnWidth: '50%'}},
    dataLabels: {enabled: false}});

  participacaoEventos.render();

  // EVENTOS: Arrecadação por evento
  const arrecadacaoEventos = new ApexCharts(document.querySelector("#arrecadacaoEventos"), {

    chart: {type: 'bar', height: 300},
    series: [{name: 'Arrecadação (R$)', data: [3500, 2200, 4800, 1800]}],
    xaxis: {categories: ['Feira de Adoção', 'Campanha Solidária', 'Mutirão Pet', 'Evento Beneficente']},
    colors: ['#4CAF50'], 
    plotOptions: {bar: {borderRadius: 6, horizontal: false, columnWidth: '55%'}},
    dataLabels: {enabled: false},
    yaxis: {title: {text: 'Valor arrecadado'}}});

  arrecadacaoEventos.render();

  // EVENTOS: Conversão do evento
  const conversaoEventos = new ApexCharts(document.querySelector("#conversaoEventos"), {

    chart: {type: 'bar', height: 300},
    series: [{name: 'Quantidade', data: [200, 120, 45]}],
    xaxis: {categories: ['Participantes', 'Interessados', 'Adoções/Doações']},
    colors: ['#E91E63'], 
    plotOptions: {bar: {horizontal: true, borderRadius: 6, distributed: true, barHeight: '60%'}},
    dataLabels: {enabled: true},
    legend: {show: false}});

  conversaoEventos.render()};

// GRÁFICOS DE DENÚNCIAS
// GRÁFICOS DE DENÚNCIAS
async function renderReportsCharts() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard_graficos_denuncias.php`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const resultado = await response.json();
    
    if (!resultado.success) return;
    
    const dados = resultado.data;

    // 1. DENÚNCIAS: Denúncias por tipo (Dinâmico)
    const tiposLabels = dados.tipos.map(item => {
      // Deixa a primeira letra maiúscula
      return item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1);
    });
    const tiposSeries = dados.tipos.map(item => Number(item.quantidade));

    new ApexCharts(document.querySelector("#denunciasTipo"), {
      chart: {type: 'bar', height: 300},
      series: [{name: 'Quantidade', data: tiposSeries}],
      xaxis: {categories: tiposLabels},
      plotOptions: {bar: {horizontal: true, borderRadius: 6, barHeight: '55%'}},
      colors: ['#E53935'],
      dataLabels: {enabled: false},
      grid: {borderColor: '#e0e0e0'}
    }).render();
    
    // 2. DENÚNCIAS: Status das denúncias (Dinâmico)
    const statusLabels = dados.status.map(item => {
      // Remove o underline se existir (ex: "em_analise" vira "Em analise")
      let label = item.status.replace(/_/g, ' ');
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
    const statusSeries = dados.status.map(item => Number(item.quantidade));

    new ApexCharts(document.querySelector("#statusDenuncias"), {
      chart: {type: 'donut', height: 300},
      series: statusSeries, 
      labels: statusLabels,
      colors: ['#FFC107', '#2196F3', '#4CAF50', '#9E9E9E'],
      legend: {position: 'bottom'}
    }).render();
    
    // 3. DENÚNCIAS: Mapa de denúncias (Mantido Estático por enquanto)  
    new ApexCharts(document.querySelector("#mapaDenuncias"), {
      chart: {type: 'heatmap', height: 320},
      series: [
        {name: 'Centro', data: [{ x: 'Seg', y: 10 }, { x: 'Ter', y: 14 }, { x: 'Qua', y: 18 }, { x: 'Qui', y: 12 }, { x: 'Sex', y: 20 }]},
        {name: 'Zona Norte', data: [{ x: 'Seg', y: 5 }, { x: 'Ter', y: 8 }, { x: 'Qua', y: 11 }, { x: 'Qui', y: 7 }, { x: 'Sex', y: 13 }]},
        {name: 'Zona Sul', data: [{ x: 'Seg', y: 7 }, { x: 'Ter', y: 10 }, { x: 'Qua', y: 15 }, { x: 'Qui', y: 9 }, { x: 'Sex', y: 16 }]},
        {name: 'Zona Leste', data: [{ x: 'Seg', y: 12 }, { x: 'Ter', y: 16 }, { x: 'Qua', y: 20 }, { x: 'Qui', y: 18 }, { x: 'Sex', y: 22 }]}
      ],
      colors: ['#E53935'], 
      dataLabels: {enabled: true},
      title: {text: 'Incidência de denúncias por região'}
    }).render();

  } catch (e) {
    console.error("Erro ao carregar gráficos dinâmicos de denúncias: ", e);
  }
}
// GRÁFICOS DE INSCRIÇÕES

async function renderRegistrationsCharts() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard_graficos_inscricoes.php`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const resultado = await response.json();
    
    if (!resultado.success) return;
    
    const dados = resultado.data;
    
    // Nomes dos meses para formatar o eixo X do gráfico
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Mapeia os dados do banco para os arrays que o ApexCharts espera
    const categorias = dados.map(item => `${mesesNomes[item.mes - 1]}/${item.ano.toString().slice(-2)}`);
    const seriesData = dados.map(item => Number(item.quantidade));

    // Fallback: se não houver dados no banco ainda, exibe um gráfico zerado
    if (categorias.length === 0) {
        categorias.push('Sem dados');
        seriesData.push(0);
    }

    // Verificador de Segurança para a biblioteca
    const checarE_Renderizar = () => {
        if (typeof ApexCharts !== 'undefined') {
            const inscricoesPeriodo = new ApexCharts(document.querySelector("#inscricoesPeriodo"), {
              chart: {type: 'line', height: 300},
              series: [{name: 'Inscrições', data: seriesData}],
              xaxis: {categories: categorias},
              stroke: {curve: 'smooth', width: 3},
              colors: ['#7956A6'], 
              dataLabels: {enabled: false},
              grid: {borderColor: '#e0e0e0'}
            });
            inscricoesPeriodo.render();
        } else {
            // Se o CDN demorou para responder, espera 100ms e tenta novamente
            setTimeout(checarE_Renderizar, 100);
        }
    };
    
    // Inicia a função de segurança
    checarE_Renderizar();

  } catch (e) {
    console.error("Erro ao carregar gráficos dinâmicos de inscrições: ", e);
  }
}

// GRÁFICOS DOS AGENDAMENTOS  
// GRÁFICOS DOS AGENDAMENTOS  
async function renderAppointmentsCharts() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard_graficos_agendamentos.php`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const resultado = await response.json();
    
    if (!resultado.success) return;
    
    const dados = resultado.data;

    // --- LÓGICA 1: AGENDAMENTOS POR MÊS ---
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const categoriasMes = dados.meses.map(item => `${mesesNomes[item.mes - 1]}/${item.ano.toString().slice(-2)}`);
    const seriesMes = dados.meses.map(item => Number(item.quantidade));

    if (categoriasMes.length === 0) {
        categoriasMes.push('Sem dados');
        seriesMes.push(0);
    }

    // --- LÓGICA 2: FLUXO POR HORÁRIO (Heatmap) ---
    // Mapeando do padrão MySQL (1=Dom, 2=Seg...) para os nomes e ordem que queremos exibir
    const diasMap = { 2: 'Seg', 3: 'Ter', 4: 'Qua', 5: 'Qui', 6: 'Sex', 7: 'Sáb', 1: 'Dom' };
    const diasOrdem = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    
    // Horários de funcionamento (Ex: das 08h às 17h). Se o abrigo tiver outros horários, basta alterar aqui
    const horasTrabalho = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    
    const heatmapSeries = horasTrabalho.map(hora => {
        const dataDia = diasOrdem.map(diaNome => {
            const dbDia = Object.keys(diasMap).find(k => diasMap[k] === diaNome);
            // Busca se existe registro para esse dia e hora específicos
            const registro = dados.fluxo.find(r => Number(r.dia_semana) === Number(dbDia) && Number(r.hora) === hora);
            return { x: diaNome, y: registro ? Number(registro.quantidade) : 0 };
        });
        return { name: `${hora.toString().padStart(2, '0')}h`, data: dataDia };
    });

    // --- RENDERIZAÇÃO ---
    const checarE_Renderizar = () => {
        if (typeof ApexCharts !== 'undefined') {
            // Renderiza Agendamentos por Mês
            new ApexCharts(document.querySelector("#agendamentosMes"), {
              chart: {type: 'line', height: 300},  
              series: [{name: 'Agendamentos', data: seriesMes}],
              xaxis: {categories: categoriasMes},
              stroke: {curve: 'smooth', width: 3},
              colors: ['#2196F3'],
              dataLabels: {enabled: false},
              grid: {borderColor: '#e0e0e0'}
            }).render();

            // Renderiza Fluxo por Horário
            new ApexCharts(document.querySelector("#horariosMovimentados"), {
              chart: {type: 'heatmap', height: 320},
              series: heatmapSeries,
              colors: ['#7956A6'],
              dataLabels: {enabled: true},
              title: {text: 'Quantidade de agendamentos por dia/hora'}
            }).render();
        } else {
            setTimeout(checarE_Renderizar, 100);
        }
    };
    
    checarE_Renderizar();

  } catch (e) {
    console.error("Erro ao carregar gráficos dinâmicos de agendamentos: ", e);
  }
}
// GRÁFICOS DAS DOAÇÕES  
function renderDonationsCharts() {
  
  // DOAÇÕES: Doações por mês
  const doacoesMes = new ApexCharts(document.querySelector("#doacoesMes"), {

    chart: {type: 'line', height: 320},
    series: [{name: 'Doações', data: [4200, 5100, 6200, 5900, 7100, 8450]}],
    xaxis: {categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']},
    stroke: {curve: 'smooth', width: 4},
    colors: ['#4CAF50'],
    dataLabels: {enabled: false},
    yaxis: {title: {text: 'Valor arrecadado (R$)'}},
    grid: {borderColor: '#e0e0e0'},
    tooltip: {y: {formatter: function (value) {return 'R$ ' + value.toLocaleString('pt-BR');}}}});
  
  doacoesMes.render()};

// GRÁFICOS DOS USUÁRIOS
// GRÁFICOS DOS USUÁRIOS
async function renderUsersCharts() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard_graficos_usuarios.php`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const resultado = await response.json();
    
    if (!resultado.success) return;
    
    const dados = resultado.data;

    // 1. Atualiza o Card KPI (Número em texto)
    const kpiElement = document.getElementById("kpiUsuariosAtivos");
    if (kpiElement) {
        kpiElement.textContent = dados.ativos;
    }

    // 2. Formata Dados de Crescimento (Linha)
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const categoriasCrescimento = dados.crescimento.map(item => `${mesesNomes[item.mes - 1]}/${item.ano.toString().slice(-2)}`);
    const seriesCrescimento = dados.crescimento.map(item => Number(item.quantidade));

    if (categoriasCrescimento.length === 0) {
        categoriasCrescimento.push('Sem dados');
        seriesCrescimento.push(0);
    }

    // 3. Formata Dados de Distribuição (Donut)
    const distribuicaoLabels = dados.distribuicao.map(item => {
        let label = item.tipo.replace(/_/g, ' ');
        return label.charAt(0).toUpperCase() + label.slice(1);
    });
    const distribuicaoSeries = dados.distribuicao.map(item => Number(item.quantidade));

    // RENDERIZAÇÃO
    const checarE_Renderizar = () => {
        if (typeof ApexCharts !== 'undefined') {
            // Gráfico Crescimento
            new ApexCharts(document.querySelector("#crescimentoUsuarios"), {
              chart: {type: 'line', height: 300},
              series: [{name: 'Novos Usuários', data: seriesCrescimento}],
              xaxis: {categories: categoriasCrescimento},
              stroke: {curve: 'smooth', width: 4},
              colors: ['#2196F3'],
              dataLabels: {enabled: false},
              grid: {borderColor: '#e0e0e0'}
            }).render();

            // Gráfico Distribuição
            new ApexCharts(document.querySelector("#distribuicaoPerfis"), {
              chart: {type: 'donut', height: 300},
              series: distribuicaoSeries,
              labels: distribuicaoLabels,
              colors: ['#7956A6', '#4CAF50', '#FFC107'],
              legend: {position: 'bottom'}
            }).render();
        } else {
            setTimeout(checarE_Renderizar, 100);
        }
    };

    checarE_Renderizar();

  } catch (e) {
    console.error("Erro ao carregar gráficos dinâmicos de usuários: ", e);
  }
}

// GRÁFICOS DAS CONFIGURAÇÕES DO SISTEMA
function renderSettingsCharts() {

  // SISTEMA: Uso do sistema
  const usoSistema = new ApexCharts(document.querySelector("#usoSistema"), {

    chart: {type: 'line', height: 300},
    series: [{name: 'Acessos', data: [120, 180, 150, 220, 310, 280, 360]}],
    xaxis: {categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']},
    stroke: {curve: 'smooth', width: 3},
    colors: ['#2196F3'],
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});

  usoSistema.render();

  // SISTEMA: Performance do sistema
  const performanceSistema = new ApexCharts(document.querySelector("#performanceSistema"), {

    chart: {type: 'area', height: 320},
    series: [{name: 'Tempo de resposta (ms)', data: [120, 140, 110, 180, 150, 130, 100]},
             {name: 'Uptime (%)', data: [99, 99.2, 99.5, 98.9, 99.8, 99.7, 100]}],
    xaxis: {categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']},
    colors: ['#7956A6', '#4CAF50'],
    stroke: {curve: 'smooth', width: 3},
    fill: {opacity: 0.3},
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});

  performanceSistema.render()};