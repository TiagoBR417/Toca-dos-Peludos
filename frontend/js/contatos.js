function verificarHorario() {
    const agora = new Date();
    const dia = agora.getDay(); // 0 = domingo
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
  
    const status = document.getElementById("statusAberto");
  
    function formatarHora(h) {
      return `${String(h).padStart(2, "0")}:00`;
    }
  
    function calcularDiferencaHoras(horaAtual, minutoAtual, horaAlvo) {
      const agoraMin = horaAtual * 60 + minutoAtual;
      const alvoMin = horaAlvo * 60;
  
      const diffMin = alvoMin - agoraMin;
      const horas = Math.floor(diffMin / 60);
      const minutosRestantes = diffMin % 60;
  
      return `${horas}h ${minutosRestantes}min`;
    }
  
    let aberto = false;
    let mensagem = "";
  
    // SEG A SEX
    if (dia >= 1 && dia <= 5) {
      if (hora >= 9 && hora < 18) {
        aberto = true;
        mensagem = `Aberto agora • Fecha às ${formatarHora(18)}`;
      } else if (hora < 9) {
        mensagem = `Abre em ${calcularDiferencaHoras(hora, minutos, 9)}`;
      } else {
        mensagem = `Fechado • Abre amanhã às ${formatarHora(9)}`;
      }
    }
  
    // SÁBADO
    else if (dia === 6) {
      if (hora >= 10 && hora < 16) {
        aberto = true;
        mensagem = `Aberto agora • Fecha às ${formatarHora(16)}`;
      } else if (hora < 10) {
        mensagem = `Abre em ${calcularDiferencaHoras(hora, minutos, 10)}`;
      } else {
        mensagem = `Fechado • Abre segunda às ${formatarHora(9)}`;
      }
    }
  
    // DOMINGO
    else {
      mensagem = `Fechado • Abre segunda às ${formatarHora(9)}`;
    }
  
    status.textContent = mensagem;
  
    if (aberto) {
      status.classList.add("aberto");
      status.classList.remove("fechado");
    } else {
      status.classList.add("fechado");
      status.classList.remove("aberto");
    }
  }
  
  verificarHorario();