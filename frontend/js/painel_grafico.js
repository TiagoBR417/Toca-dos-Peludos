const navItems = document.querySelectorAll('.nav-links li');
const dashboardContent = document.getElementById('dashboard-content');
const dashboards = {

  pets: `
    <h1>Dashboard Pets</h1>
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
        <h3>🐾 Taxa de adoção</h3>
        <div id="adocaoPets"></div>
      </div>
      <div class="chart-card">
        <h3>🎂 Idade média</h3>
        <div id="idadePets"></div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; margin-bottom: 15px;">
      <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; margin-top: 40px; margin-bottom: 15px; color: #1e293b;">📋 Gerenciar Cadastro de Pets</h2>
      <button class="btn-accent" onclick="abrirModalCriarPet()">➕ Novo Pet</button>
      </div>
    <div id="container-tabela-pets"></div>
  `,

  eventos: `
    <h1>Dashboard Eventos</h1>
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
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; margin-bottom: 15px;">
      <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; margin-top: 40px; margin-bottom: 15px; color: #1e293b;">📅 Gerenciar Agenda de Eventos</h2>
      <button class="btn-accent" onclick="abrirModalCriarEvento()">➕ Novo Evento</button>
      </div>
    <div id="container-tabela-eventos"></div>
  `,


  denuncias: `
    <h1>Dashboard Denúncias</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>🚨 Denúncias por tipo</h3>
        <div id="denunciasTipo"></div>
      </div>
      <div class="chart-card">
        <h3>📍 Mapa de denúncias</h3>
        <div id="mapaDenuncias"></div>
      </div>
      <div class="chart-card">
        <h3>📋 Status</h3>
        <div id="statusDenuncias"></div>
      </div>
    </div>
  `,

  inscricoes: `
    <h1>Dashboard Inscrições</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>📝 Inscrições por período</h3>
        <div id="inscricoesPeriodo"></div>
      </div>
      <div class="chart-card">
        <h3>📈 Taxa de aprovação</h3>
        <div id="taxaAprovacao"></div>
      </div>
      <div class="chart-card">
        <h3>🌐 Origem inscrições</h3>
        <div id="origemInscricoes"></div>
      </div>
    </div>
  `,

  agendamentos: `
    <h1>Dashboard Agendamentos</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>📅 Agendamentos</h3>
        <div id="agendamentosDia"></div>
      </div>
      <div class="chart-card">
        <h3>⏰ Horários movimentados</h3>
        <div id="horariosMovimentados"></div>
      </div>
      <div class="chart-card">
        <h3>✅ Comparecimento</h3>
        <div id="taxaComparecimento"></div>
      </div>
    </div>
  `,

  doacoes: `
    <h1>Dashboard Doações</h1>
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

  usuarios: `
    <h1>Dashboard Usuários</h1>
    <div class="charts-grid">
      <div class="kpi-card">
        <h3>🔥 Usuários Ativos</h3>
        <span>1.284</span>
        <p>+12% em relação ao mês anterior</p>
      </div>
      <div class="chart-card">
        <h3>👥 Crescimento</h3>
        <div id="crescimentoUsuarios"></div>
      </div>
      <div class="chart-card">
        <h3>📊 Retenção</h3>
        <div id="retencaoUsuarios"></div>
      </div>
      <div class="chart-card">
        <h3>➗ Distribuição</h3>
        <div id="distribuicaoPerfis"></div>
      </div>
    </div>
  `,

  configuracoes: `
    <h1>Dashboard Sistema</h1>
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
      <div class="timeline-item">
        <span class="time">14:25</span>
        <div class="content">
          <h4>Integração WhatsApp</h4>
          <p>Mensagem automática enviada.</p>
        </div>
      </div>
      </div>
        <div id="logsAcoes"></div>
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
      <div class="integracao-card">
        <h3>Pagamentos</h3>
        <p>Status: <strong>Ativo</strong></p>
      </div>
      <div class="integracao-card">
        <h3>Google Maps</h3>
        <p>Status: <strong>Ativo</strong></p>
      </div>
      </div>
    </div>
  `
};

dashboardContent.innerHTML = dashboards.pets;
renderPetsCharts();
if (typeof carregarDadosTabelaDashboard === 'function') carregarDadosTabelaDashboard('pets', 'container-tabela-pets');
navItems[0].classList.add('active');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    const dashboard = item.dataset.dashboard;
    dashboardContent.replaceChildren();
    dashboardContent.innerHTML = dashboards[dashboard];
    // DASHBOARDS: Renderização dos gráficos específicos para cada dashboard
    switch (dashboard) {
      case 'pets':
      renderPetsCharts();
      if (typeof carregarDadosTabelaDashboard === 'function') carregarDadosTabelaDashboard('pets', 'container-tabela-pets');
      break;
      case 'eventos':
      renderEventsCharts();
      if (typeof carregarDadosTabelaDashboard === 'function') carregarDadosTabelaDashboard('eventos', 'container-tabela-eventos');
      break;
      case 'denuncias':
      renderReportsCharts();
      break;
      case 'inscricoes':
      renderRegistrationsCharts();
      break;
      case 'agendamentos':
      renderAppointmentsCharts();
      break;
      case 'doacoes':
      renderDonationsCharts();
      break;
      case 'usuarios':
      renderUsersCharts();
      break;
      case 'configuracoes':
      renderSettingsCharts();
      break;
    }
  });
});

// GRÁFICO DE PETS
function renderPetsCharts() {

  // PETS: Status dos pets
  const statusPets = new ApexCharts(document.querySelector("#statusPets"), {

    chart: {type: 'donut', height: 300},
    series: [40, 25, 20, 15],
    labels: ['Disponível', 'Tratamento', 'Adotado', 'Lar Temporário'],
    colors: ['#4CAF50', '#FFC107', '#2196F3', '#9C27B0']});

  statusPets.render();

  // PETS: Espécies e portes
  const portesPets = new ApexCharts(document.querySelector("#portesPets"), {

    chart: {type: 'bar', stacked: true, height: 300},
    series: [{name: 'Pequeno', data: [30, 20, 10]}, {name: 'Médio', data: [25, 18, 5]}, {name: 'Grande', data: [10, 5, 2]}],
    xaxis: {categories: ['Cachorros', 'Gatos', 'Outros']},
    colors: ['#7956a6', '#f4b400', '#4CAF50']});

  portesPets.render();

  // PETS: Taxa de adoção
  const adocaoPets = new ApexCharts(document.querySelector("#adocaoPets"), {

    chart: {type: 'line', height: 300},
    series: [{name: 'Adoções', data: [15, 22, 30, 28, 35, 42]}],
    xaxis: {categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']},
    stroke: {curve: 'smooth'},
    colors: ['#E91E63']});

  adocaoPets.render();

  // PETS: Idade média dos pets
  const idadePets = new ApexCharts(document.querySelector("#idadePets"), {

    chart: {type: 'bar', height: 300, toolbar: {show: false}},
    series: [{name: 'Quantidade', data: [18, 35, 12]}],
    xaxis: {categories: ['Filhote', 'Adulto', 'Idoso'], title: {text: 'Faixa etária'}},
    yaxis: {title: {text: 'Quantidade de pets'}},
    plotOptions: {bar: {borderRadius: 6, columnWidth: '55%', distributed: true}},
    colors: ['#4CAF50', '#FFC107', '#7956A6'],
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});

  idadePets.render()};

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
function renderReportsCharts() {

  // DENÚNCIAS: Denúncias por tipo
  const denunciasTipo = new ApexCharts(document.querySelector("#denunciasTipo"), {

    chart: {type: 'bar', height: 300},
    series: [{name: 'Quantidade', data: [45, 30, 20, 15]}],
    xaxis: {categories: ['Maus-tratos', 'Abandono', 'Negligência', 'Exploração']},
    plotOptions: {bar: {horizontal: true, borderRadius: 6, barHeight: '55%'}},
    colors: ['#E53935'],
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});
  
  denunciasTipo.render();
  
  // DENÚNCIAS: Status das denúncias
  const statusDenuncias = new ApexCharts(document.querySelector("#statusDenuncias"), {
  
    chart: {type: 'donut', height: 300},
    series: [35, 25, 40], 
    labels: ['Aberta', 'Em análise', 'Resolvida'],
    colors: ['#FFC107', '#2196F3', '#4CAF50'],
    legend: {position: 'bottom'}});
  
  statusDenuncias.render();
  
  // DENÚNCIAS: Mapa de denúncias (Heatmap)  
  const mapaDenuncias = new ApexCharts(document.querySelector("#mapaDenuncias"), {
        
    chart: {type: 'heatmap', height: 320},
    series: [{name: 'Centro', data: [
      { x: 'Seg', y: 10 }, 
      { x: 'Ter', y: 14 }, 
      { x: 'Qua', y: 18 }, 
      { x: 'Qui', y: 12 }, 
      { x: 'Sex', y: 20 }]},
            {name: 'Zona Norte', data: [
      { x: 'Seg', y: 5 }, 
      { x: 'Ter', y: 8 }, 
      { x: 'Qua', y: 11 }, 
      { x: 'Qui', y: 7 }, 
      { x: 'Sex', y: 13 }]},
            {name: 'Zona Sul', data: [
      { x: 'Seg', y: 7 }, 
      { x: 'Ter', y: 10 }, 
      { x: 'Qua', y: 15 }, 
      { x: 'Qui', y: 9 }, 
      { x: 'Sex', y: 16 }]},
            {name: 'Zona Leste', data: [
      { x: 'Seg', y: 12 }, 
      { x: 'Ter', y: 16 }, 
      { x: 'Qua', y: 20 }, 
      { x: 'Qui', y: 18 }, 
      { x: 'Sex', y: 22 }]}],
    colors: ['#E53935'], 
    dataLabels: {enabled: true},
    title: {text: 'Incidência de denúncias por região'}});
  
  mapaDenuncias.render()};

// GRÁFICOS DE INSCRIÇÕES
function renderRegistrationsCharts() {

  // INSCRIÇÕES: Inscrições por período
  const inscricoesPeriodo = new ApexCharts(document.querySelector("#inscricoesPeriodo"), {
  
    chart: {type: 'line', height: 300},
    series: [{name: 'Inscrições', data: [18, 25, 32, 28, 40, 52]}],
    xaxis: {categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']},
    stroke: {curve: 'smooth', width: 3},
    colors: ['#7956A6'], 
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});
  
  inscricoesPeriodo.render();
  
    // INSCRIÇÕES: Origem das inscrições
    const origemInscricoes = new ApexCharts(document.querySelector("#origemInscricoes"), {
  
      chart: {type: 'pie', height: 300}, 
      series: [45, 30, 15, 10], 
      labels: ['Site', 'Instagram', 'Facebook', 'Indicação'],
      colors: ['#4CAF50', '#E91E63', '#2196F3', '#FFC107'],
      legend: {position: 'bottom'}});
  
    origemInscricoes.render();
  
    // INSCRIÇÕES: Taxa de aprovação
    const taxaAprovacao = new ApexCharts(document.querySelector("#taxaAprovacao"),{
  
      chart: {type: 'radialBar', height: 320},
      series: [78],
      labels: ['Aprovação'],
      colors: ['#4CAF50'],
      plotOptions: {radialBar: {hollow: {size: '60%'},
      dataLabels: {name: {fontSize: '16px'},
      value: {fontSize: '28px', formatter: function (val) {return val + '%';}}}}}});
  
  taxaAprovacao.render()};

// GRÁFICOS DOS AGENDAMENTOS  
function renderAppointmentsCharts() {

  // AGENDAMENTOS: Agendamentos por dia
  const agendamentosDia = new ApexCharts(document.querySelector("#agendamentosDia"), {

    chart: {type: 'line', height: 300},  
    series: [{name: 'Agendamentos', data: [12, 18, 15, 22, 28, 20, 16]}],
    xaxis: {categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']},
    stroke: {curve: 'smooth', width: 3},
    colors: ['#2196F3'],
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});
  
  agendamentosDia.render();
  
  // AGENDAMENTOS: Taxa de comparecimento
  const taxaComparecimento = new ApexCharts(document.querySelector("#taxaComparecimento"), {
  
    chart: {type: 'radialBar', height: 320},
    series: [82],  
    labels: ['Comparecimento'],
    colors: ['#4CAF50'],
    plotOptions: {radialBar: {hollow: {size: '60%'},
    dataLabels: {name: {fontSize: '16px'},
    value: {fontSize: '28px', formatter: function (val) {return val + '%';}}}}}});
  
  taxaComparecimento.render();
  
  // AGENDAMENTOS: Horários mais movimentados
  const horariosMovimentados = new ApexCharts(document.querySelector("#horariosMovimentados"), {
  
    chart: {type: 'heatmap', height: 320},
    series: [{name: '08h', data: [
      { x: 'Seg', y: 5 },
      { x: 'Ter', y: 8 },
      { x: 'Qua', y: 6 },
      { x: 'Qui', y: 9 },
      { x: 'Sex', y: 7 }]},
            {name: '10h', data: [
      { x: 'Seg', y: 10 },
      { x: 'Ter', y: 12 },
      { x: 'Qua', y: 15 },
      { x: 'Qui', y: 13 },
      { x: 'Sex', y: 16 }]},
            {name: '14h', data: [
      { x: 'Seg', y: 14 },
      { x: 'Ter', y: 18 },
      { x: 'Qua', y: 20 },
      { x: 'Qui', y: 17 },
      { x: 'Sex', y: 22 }]},
            {name: '16h', data: [
      { x: 'Seg', y: 8 },
      { x: 'Ter', y: 11 },
      { x: 'Qua', y: 13 },
      { x: 'Qui', y: 12 },
      { x: 'Sex', y: 15 }]}],
    colors: ['#7956A6'],
    dataLabels: {enabled: true},
    title: {text: 'Fluxo de agendamentos por horário'}});
  
  horariosMovimentados.render()};

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
function renderUsersCharts() {

  // USUÁRIOS: Crescimento de usuários
  const crescimentoUsuarios = new ApexCharts(document.querySelector("#crescimentoUsuarios"), {
  
    chart: {type: 'line', height: 300},
    series: [{name: 'Usuários', data: [120, 180, 260, 340, 420, 510]}],
    xaxis: {categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']},
    stroke: {curve: 'smooth', width: 4},
    colors: ['#2196F3'],
    dataLabels: {enabled: false},
    grid: {borderColor: '#e0e0e0'}});
  
  crescimentoUsuarios.render();
  
  // USUÁRIOS: Distribuição de perfis
  const distribuicaoPerfis = new ApexCharts(document.querySelector("#distribuicaoPerfis"), {
  
    chart: {type: 'donut', height: 300},
    series: [55, 30, 15],
    labels: ['Voluntário', 'Adotante', 'Administrador'],
    colors: ['#7956A6', '#4CAF50', '#FFC107'],
    legend: {position: 'bottom'}});
  
  distribuicaoPerfis.render();
  
  // USUÁRIOS: Retenção de usuários
  const retencaoUsuarios = new ApexCharts(document.querySelector("#retencaoUsuarios"), {
  
    chart: {type: 'line', height: 300},
    series: [{name: 'Retenção (%)', data: [68, 72, 75, 73, 78, 82]}],
    xaxis: {categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']}, 
    stroke: {curve: 'smooth', width: 4},
    colors: ['#E91E63'],
    dataLabels: {enabled: false},
    yaxis: {max: 100, title: {text: 'Percentual (%)'}},
    grid: {borderColor: '#e0e0e0'}});
  
  retencaoUsuarios.render()};

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