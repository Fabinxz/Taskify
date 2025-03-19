document.addEventListener("DOMContentLoaded", () => {
    
    let chartHojeInstance = null;
    let chartSemanaInstance = null;
    let chartMesInstance = null;
    let chartAnoInstance = null;

    function atualizarCabecalho() {
        const agora = new Date();
        const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const mesesDoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        const diaDaSemana = diasDaSemana[agora.getDay()];
        const diaDoMes = agora.getDate();
        const mesDoAno = mesesDoAno[agora.getMonth()];

        const cabecalho = document.querySelector("header nav ul li span");
        cabecalho.textContent = `${diaDaSemana}, ${diaDoMes} de ${mesDoAno}`;
    }

    atualizarCabecalho();
    const hojeEl = document.getElementById("hoje");
    const semanaEl = document.getElementById("semana");
    const mesEl = document.getElementById("mes");
    const anoEl = document.getElementById("ano");

    let metaHoje = parseInt(localStorage.getItem("metaHoje")) || 100;
    let metaSemana = parseInt(localStorage.getItem("metaSemana")) || 700;
    let metaMes = parseInt(localStorage.getItem("metaMes")) || 2800;
    let metaAno = parseInt(localStorage.getItem("metaAno")) || 25000;

    document.getElementById('metaHoje').textContent = metaHoje;
    document.getElementById('metaSemana').textContent = metaSemana;
    document.getElementById('metaMes').textContent = metaMes;
    document.getElementById('metaAno').textContent = metaAno;

    verificarResetDiario();
    verificarResetSemanal();
    verificarResetMensal();
    verificarResetAnual();
    
    hoje = parseInt(localStorage.getItem("hoje")) || 0;
    semana = parseInt(localStorage.getItem("semana")) || 0;
    mes = parseInt(localStorage.getItem("mes")) || 1500;
    ano = parseInt(localStorage.getItem("ano")) || 2061;

    localStorage.setItem("hoje", hoje);
    localStorage.setItem("semana", semana);
    localStorage.setItem("mes", mes);
    localStorage.setItem("ano", ano);

    atualizarUI();

    window.adicionarQuestao = function (quantidade) {
        hoje += quantidade;
        semana += quantidade;
        mes += quantidade;
        ano += quantidade;

        localStorage.setItem("hoje", hoje);
        localStorage.setItem("semana", semana);
        localStorage.setItem("mes", mes);
        localStorage.setItem("ano", ano);

        atualizarUI();
    };

    window.removerQuestao = function (quantidade) {
        if (hoje >= quantidade) {
            hoje -= quantidade;
            semana -= quantidade;
            mes -= quantidade;
            ano -= quantidade;

            localStorage.setItem("hoje", hoje);
            localStorage.setItem("semana", semana);
            localStorage.setItem("mes", mes);
            localStorage.setItem("ano", ano);

            atualizarUI();
        } else {
            showNotification("Não é possível remover mais questões!");
        }
    };

    function atualizarUI() {
        // hojeEl.textContent = hoje;
        // semanaEl.textContent = semana;
        // mesEl.textContent = mes;
        // anoEl.textContent = ano;

        atualizarGrafico("chartHoje", hoje, metaHoje);
        atualizarGrafico("chartSemana", semana, metaSemana);
        atualizarGrafico("chartMes", mes, metaMes);
        atualizarGrafico("chartAno", ano, metaAno);
    }

    function atualizarGrafico(canvasId, valor, meta) {
        const container = document.querySelector(`#${canvasId}`).parentNode;
        const existingText = container.querySelector('.chart-text');
        if (existingText) existingText.remove();

        const chartText = document.createElement('div');
        chartText.className = 'chart-text';
        chartText.innerHTML = `<span>${valor}</span>/${meta}`;
        container.appendChild(chartText);
        const progresso = Math.min(valor / meta, 1);
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');

        const chartConfig = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [progresso, 1 - progresso],
                    backgroundColor: ['#0049FF', '#c0c0c0'],
                    borderWidth: 0,
                }]
            },
            options: {
                cutout: '80%',
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
        };

        function atualizarGraficosSemRedraw() {
            const charts = [
                { instance: chartHojeInstance, id: 'chartHoje', valor: hoje, meta: metaHoje },
                { instance: chartSemanaInstance, id: 'chartSemana', valor: semana, meta: metaSemana },
                { instance: chartMesInstance, id: 'chartMes', valor: mes, meta: metaMes },
                { instance: chartAnoInstance, id: 'chartAno', valor: ano, meta: metaAno }
            ];
        
            charts.forEach(({ instance, id, valor, meta }) => {
                if (instance) {
                    const isDarkMode = document.body.classList.contains("dark-mode");
                    
                    const textElement = document.querySelector(`#${id}`).parentNode.querySelector('.chart-text');
                    textElement.style.color = isDarkMode ? '#fff' : '#000';
        
                    instance.data.datasets[0].backgroundColor[1] = isDarkMode ? '#3d3d3d' : '#e0e0e0';
                    instance.update();
                }
            });
        }
        

        switch (canvasId) {
            case 'chartHoje':
                if (chartHojeInstance) {
                    chartHojeInstance.data.datasets[0].data = [progresso, 1 - progresso];
                    chartHojeInstance.update();
                } else {
                    chartHojeInstance = new Chart(ctx, chartConfig);
                }
                break;

            case 'chartSemana':
                if (chartSemanaInstance) {
                    chartSemanaInstance.data.datasets[0].data = [progresso, 1 - progresso];
                    chartSemanaInstance.update();
                } else {
                    chartSemanaInstance = new Chart(ctx, chartConfig);
                }
                break;

            case 'chartMes':
                if (chartMesInstance) {
                    chartMesInstance.data.datasets[0].data = [progresso, 1 - progresso];
                    chartMesInstance.update();
                } else {
                    chartMesInstance = new Chart(ctx, chartConfig);
                }
                break;

            case 'chartAno':
                if (chartAnoInstance) {
                    chartAnoInstance.data.datasets[0].data = [progresso, 1 - progresso];
                    chartAnoInstance.update();
                } else {
                    chartAnoInstance = new Chart(ctx, chartConfig);
                }
                break;
        }
    }

    function getBrasiliaDate() {
        const agoraUTC = Date.now();
        const offsetBrasilia = -3 * 60 * 60 * 1000;
        return new Date(agoraUTC + offsetBrasilia);
    }
    

    function verificarResetDiario() {
        const dataBrasilia = getBrasiliaDate();
        const hojeFormatado = dataBrasilia.toISOString().split('T')[0]; 
        
        if(localStorage.getItem("ultimaDataDiaria") !== hojeFormatado) {
            hoje = 0;
            localStorage.setItem("hoje", hoje);
            localStorage.setItem("ultimaDataDiaria", hojeFormatado);
            atualizarUI();
        }
    }

    setInterval(verificarResetDiario, 60000);
    verificarResetDiario();
    function verificarResetSemanal() {
        const dataBrasilia = getBrasiliaDate();
        const ultimoReset = localStorage.getItem("ultimaDataSemanal") || "1970-01-01";
        
        const diaSemana = dataBrasilia.getDay();
        const inicioSemana = new Date(dataBrasilia);
        inicioSemana.setDate(dataBrasilia.getDate() - diaSemana);
        inicioSemana.setHours(0, 0, 0, 0);
        const inicioSemanaFormatado = inicioSemana.toISOString().split('T')[0];
        
        if(ultimoReset !== inicioSemanaFormatado) {
            semana = 0;
            localStorage.setItem("semana", semana);
            localStorage.setItem("ultimaDataSemanal", inicioSemanaFormatado);
            atualizarUI();
        }
    }

    function verificarResetMensal() {
        const dataBrasilia = getBrasiliaDate();
        const inicioMes = new Date(dataBrasilia.getFullYear(), dataBrasilia.getMonth(), 1);
        const inicioMesFormatado = inicioMes.toISOString().split('T')[0];
        
        if(localStorage.getItem("ultimaDataMensal") !== inicioMesFormatado) {
            mes = 0;
            localStorage.setItem("mes", mes);
            localStorage.setItem("ultimaDataMensal", inicioMesFormatado);
            atualizarUI();
        }
    }
    
    function verificarResetAnual() {
    const dataBrasilia = getBrasiliaDate();
    const inicioAno = new Date(dataBrasilia.getFullYear(), 0, 1);
    const inicioAnoFormatado = inicioAno.toISOString().split('T')[0];
    
    if(localStorage.getItem("ultimaDataAnual") !== inicioAnoFormatado) {
        ano = 0;
        localStorage.setItem("ano", ano);
        localStorage.setItem("ultimaDataAnual", inicioAnoFormatado);
        atualizarUI();
    }
}

function init() {
    atualizarCabecalho();
    
    verificarResetDiario();
    verificarResetSemanal();
    verificarResetMensal();
    verificarResetAnual();
    
    hoje = parseInt(localStorage.getItem("hoje")) || 0;
    semana = parseInt(localStorage.getItem("semana")) || 0;
    mes = parseInt(localStorage.getItem("mes")) || 0;
    ano = parseInt(localStorage.getItem("ano")) || 0;
    
    setInterval(() => {
        verificarResetDiario();
        verificarResetSemanal();
        verificarResetMensal();
        verificarResetAnual();
    }, 60000);
}

    init();

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        body.classList[savedTheme === "dark" ? "add" : "remove"]("dark-mode");
        body.classList[savedTheme === "light" ? "add" : "remove"]("light-mode");
        themeIcon.classList.toggle("bi-sun", savedTheme === "light");
        themeIcon.classList.toggle("bi-moon", savedTheme === "dark");
    }

    const modal = document.querySelector('.modal-metas');
    const btnEditar = document.querySelector('.btn-editar-metas');
    const btnFechar = document.querySelector('.fechar-modal');
    const btnCancelar = document.querySelector('.btn-cancelar');
    const btnSalvar = document.querySelector('.btn-salvar');
    
    function abrirModal() {
        modal.style.display = 'flex';
        document.getElementById('editarMetaHoje').value = metaHoje;
        document.getElementById('editarMetaSemana').value = metaSemana;
        document.getElementById('editarMetaMes').value = metaMes;
        document.getElementById('editarMetaAno').value = metaAno;
    }
    
    function fecharModal() {
        modal.style.display = 'none';
    }
    
    btnEditar.addEventListener('click', abrirModal);
    btnFechar.addEventListener('click', fecharModal);
    btnCancelar.addEventListener('click', fecharModal);
    
    btnSalvar.addEventListener('click', () => {
        const metasAntigas = {
            hoje: metaHoje,
            semana: metaSemana,
            mes: metaMes,
            ano: metaAno
        };
    
        metaHoje = parseInt(document.getElementById('editarMetaHoje').value) || 100;
        metaSemana = parseInt(document.getElementById('editarMetaSemana').value) || 700;
        metaMes = parseInt(document.getElementById('editarMetaMes').value) || 2800;
        metaAno = parseInt(document.getElementById('editarMetaAno').value) || 25000;
    
        if(metaHoje !== metasAntigas.hoje || 
           metaSemana !== metasAntigas.semana ||
           metaMes !== metasAntigas.mes ||
           metaAno !== metasAntigas.ano) {
            
            showNotification("Metas atualizadas com sucesso!", "success");
        } else {
            showNotification("Nenhuma alteração foi realizada", "info");
        }
    
        localStorage.setItem("metaHoje", metaHoje);
        localStorage.setItem("metaSemana", metaSemana);
        localStorage.setItem("metaMes", metaMes);
        localStorage.setItem("metaAno", metaAno);
    
        atualizarUI();
        fecharModal();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });

    function salvarMetas() {
        const metasAntigas = {
            hoje: metaHoje,
            semana: metaSemana,
            mes: metaMes,
            ano: metaAno
        };
    
        const novasMetas = {
            hoje: parseInt(document.getElementById('editarMetaHoje').value) || 100,
            semana: parseInt(document.getElementById('editarMetaSemana').value) || 700,
            mes: parseInt(document.getElementById('editarMetaMes').value) || 2800,
            ano: parseInt(document.getElementById('editarMetaAno').value) || 25000
        };
    
        if(novasMetas.hoje !== metasAntigas.hoje || 
           novasMetas.semana !== metasAntigas.semana ||
           novasMetas.mes !== metasAntigas.mes ||
           novasMetas.ano !== metasAntigas.ano) {
            
            showNotification("Metas atualizadas com sucesso!", "success");
        } else {
            showNotification("Nenhuma alteração foi realizada", "info");
        }

        metaHoje = novasMetas.hoje;
        metaSemana = novasMetas.semana;
        metaMes = novasMetas.mes;
        metaAno = novasMetas.ano;
    
        localStorage.setItem("metaHoje", metaHoje);
        localStorage.setItem("metaSemana", metaSemana);
        localStorage.setItem("metaMes", metaMes);
        localStorage.setItem("metaAno", metaAno);
    
        atualizarUI();
    }

    themeToggle.addEventListener("click", () => {
        const isDarkBefore = body.classList.contains("dark-mode");
        
        if (isDarkBefore) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
            themeIcon.classList.replace("bi-moon", "bi-sun");
        } else {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            themeIcon.classList.replace("bi-sun", "bi-moon");
        }

        atualizarGraficosSemRedraw();
    });

    window.addEventListener('load', () => {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loader').remove();
        }, 500);
    });

    document.querySelectorAll('.modal-corpo input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                salvarMetas();  
                fecharModal();
            }
        });
    });

    function showNotification(message, type = 'error') {
        const icons = {
            error: 'bi-exclamation-triangle-fill',
            success: 'bi-check-circle-fill',
            info: 'bi-info-circle-fill'
        };
    
        const container = document.querySelector('.notifications-container');
        const notification = document.createElement('div');
        
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="bi ${icons[type]} notification-icon"></i>
            <span>${message}</span>
        `;
    
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    
        notification.addEventListener('click', () => {
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 400);
        });
    }

});