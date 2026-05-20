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
  `,

  denuncias: `
    <h1>Dashboard Denúncias</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>🚨 Denúncias por tipo</h3>
        <div id="statusPets"></div>
      </div>
      <div class="chart-card">
        <h3>📍 Mapa de denúncias</h3>
        <div id="portesPets"></div>
      </div>
      <div class="chart-card">
        <h3>📋 Status</h3>
        <div id="adocaoPets"></div>
      </div>
    </div>
  `,

  inscricoes: `
    <h1>Dashboard Inscrições</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>📝 Inscrições por período</h3>
        <div id="statusPets"></div>
      </div>
      <div class="chart-card">
        <h3>📈 Taxa de aprovação</h3>
        <div id="portesPets"></div>
      </div>
      <div class="chart-card">
        <h3>🌐 Origem inscrições</h3>
        <div id="adocaoPets"></div>
      </div>
    </div>
  `,

  agendamentos: `
    <h1>Dashboard Agendamentos</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>📅 Agendamentos</h3>
        <div id="statusPets"></div>
      </div>
      <div class="chart-card">
        <h3>⏰ Horários movimentados</h3>
        <div id="portesPets"></div>
      </div>
      <div class="chart-card">
        <h3>✅ Comparecimento</h3>
        <div id="adocaoPets"></div>
      </div>
    </div>
  `,

  doacoes: `
    <h1>Dashboard Doações</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>💰 Total arrecadado</h3>
        <div id="statusPets"></div>
      </div>
      <div class="chart-card">
        <h3>📈 Doações por mês</h3>
        <div id="portesPets"></div>
      </div>
      <div class="chart-card">
        <h3>💳 Origem das doações</h3>
        <div id="adocaoPets"></div>
      </div>
    </div>
  `,

  usuarios: `
    <h1>Dashboard Usuários</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>👥 Crescimento</h3>
        <div id="statusPets"></div>
      </div>
      <div class="chart-card">
        <h3>🔥 Usuários ativos</h3>
        <div id="portesPets"></div>
      </div>
      <div class="chart-card">
        <h3>📊 Retenção</h3>
        <div id="adocaoPets"></div>
      </div>
    </div>
  `,

  configuracoes: `
    <h1>Dashboard Sistema</h1>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>⚙️ Uso do sistema</h3>
        <div id="statusPets"></div>
      </div>
      <div class="chart-card">
        <h3>📜 Logs</h3>
        <div id="portesPets"></div>
      </div>
      <div class="chart-card">
        <h3>🚀 Performance</h3>
        <div id="adocaoPets"></div>
      </div>
    </div>
  `
};

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    const dashboard = item.dataset.dashboard;
    dashboardContent.innerHTML = dashboards[dashboard];

if (dashboard === 'pets') {
  renderPetsCharts();
}
  });
});

function renderPetsCharts() {

  // PETS: Status dos pets

  const statusPets = new ApexCharts(document.querySelector("#statusPets"), {

    chart: {
      type: 'donut',
      height: 300
    },

    series: [40, 25, 20, 15],

    labels: [
      'Disponível',
      'Tratamento',
      'Adotado',
      'Lar Temporário'
    ],

    colors: [
      '#4CAF50',
      '#FFC107',
      '#2196F3',
      '#9C27B0'
    ]
  });

  statusPets.render();

  // PETS: Espécies e portes

  const portesPets = new ApexCharts(document.querySelector("#portesPets"), {

    chart: {
      type: 'bar',
      stacked: true,
      height: 300
    },

    series: [
      {
        name: 'Pequeno',
        data: [30, 20, 10]
      },
      {
        name: 'Médio',
        data: [25, 18, 5]
      },
      {
        name: 'Grande',
        data: [10, 5, 2]
      }
    ],

    xaxis: {
      categories: ['Cachorros', 'Gatos', 'Outros']
    },

    colors: ['#7956a6', '#f4b400', '#4CAF50']
  });

  portesPets.render();

  // PETS: Taxa de adoção

  const adocaoPets = new ApexCharts(document.querySelector("#adocaoPets"), {

    chart: {
      type: 'line',
      height: 300
    },

    series: [{
      name: 'Adoções',
      data: [15, 22, 30, 28, 35, 42]
    }],

    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    },

    stroke: {
      curve: 'smooth'
    },

    colors: ['#E91E63']
  });

  adocaoPets.render();

    // PETS: Idade média dos pets

    const idadePets = new ApexCharts(document.querySelector("#idadePets"), {

  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    }
  },

  series: [{
    name: 'Quantidade',
    data: [18, 35, 12]
  }],

  xaxis: {
    categories: ['Filhote', 'Adulto', 'Idoso'],
    title: {
      text: 'Faixa etária'
    }
  },

  yaxis: {
    title: {
      text: 'Quantidade de pets'
    }
  },

  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '55%',
      distributed: true
    }
  },

  colors: [
    '#4CAF50',
    '#FFC107',
    '#7956A6'
  ],

  dataLabels: {
    enabled: false
  },

  grid: {
    borderColor: '#e0e0e0'
  }

});

idadePets.render()};