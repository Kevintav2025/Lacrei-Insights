// Garante que o código só rode após o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializa os ícones da biblioteca Lucide
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Dados de Configuração Inicial
    const dadosSemestre = {
        meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        valores: [320, 450, 600, 580, 890, 1200]
    };

    // 3. Configuração do Gráfico de Linha principal
    const ctx = document.getElementById('meuGrafico');
    if (ctx) {
        const context = ctx.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.5)'); 
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

        window.meuGrafico = new Chart(context, {
            type: 'line',
            data: {
                labels: dadosSemestre.meses,
                datasets: [{
                    label: 'Consultas',
                    data: dadosSemestre.valores,
                    borderColor: '#7c3aed',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 4. Inicializa componentes da página
    carregarTabela();
    inicializarPizza();
});

// --- DADOS E VARIÁVEIS GLOBAIS ---

const profissionais = [
    { nome: "Dr. Alex Silva", especialidade: "Psicologia", status: "Online", paciente: "Marcos Oliveira" },
    { nome: "Dra. Beatriz Santos", especialidade: "Endocrinologia", status: "Online", paciente: "Julia Costa" },
    { nome: "Dr. Caio Souza", especialidade: "Ginecologia", status: "Offline", paciente: "Fernanda Lima" },
    { nome: "Dra. Daniela Lima", especialidade: "Clínica Geral", status: "Online", paciente: "Roberto Alves" }
];

const prontuarios = {
    "Dr. Alex Silva": "Paciente apresenta melhora no quadro de ansiedade. Mantida a recomendação de exercícios de respiração.",
    "Dra. Beatriz Santos": "Exames de rotina analisados. Taxas hormonais normalizadas. Paciente seguirá com a dosagem atual.",
    "Dr. Caio Souza": "Consulta preventiva realizada sem intercorrências. Solicitado ultrassom de rotina.",
    "Dra. Daniela Lima": "Paciente relatou sintomas gripais. Prescrito repouso e hidratação. Observar evolução."
};

// --- FUNÇÕES DE INTERFACE ---

function carregarTabela() {
    const corpoTabela = document.getElementById('corpo-tabela');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = "";
    profissionais.forEach(pro => {
        const classeStatus = pro.status === "Online" ? "status-online" : "status-offline";
        corpoTabela.innerHTML += `
            <tr>
                <td><strong>${pro.nome}</strong></td>
                <td>${pro.especialidade}</td>
                <td><span class="status-badge ${classeStatus}">${pro.status}</span></td>
                <td><button class="btn-detalhes" onclick="abrirProntuario('${pro.nome}', '${pro.especialidade}', '${pro.paciente}')">Detalhes</button></td>
            </tr>
        `;
    });
}

window.atualizarGrafico = function(periodo) {
    if (!window.meuGrafico) return;

    const dados = {
        semestre: {
            meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            valores: [320, 450, 600, 580, 890, 1200]
        },
        ano: {
            meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            valores: [320, 450, 600, 580, 890, 1200, 1350, 1100, 1400, 1550, 1700, 1900]
        }
    };

    // Atualiza dados do gráfico
    window.meuGrafico.data.labels = dados[periodo].meses;
    window.meuGrafico.data.datasets[0].data = dados[periodo].valores;
    window.meuGrafico.update();
    
    // Gerencia estado visual dos botões
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
    
    // Pequeno ajuste para garantir que o botão clicado receba a classe 'active'
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
};

window.filtrarTabela = function() {
    const busca = document.getElementById('inputBusca');
    if (!busca) return;
    
    const termo = busca.value.toLowerCase();
    const linhas = document.querySelectorAll('#corpo-tabela tr');
    
    linhas.forEach(linha => {
        const textoLinha = linha.innerText.toLowerCase();
        linha.style.display = textoLinha.includes(termo) ? "" : "none";
    });
};

window.abrirProntuario = function(nome, espec, pac) {
    const modal = document.getElementById('modalProntuario');
    if (!modal) return;

    document.getElementById('modalNomeProfissional').innerText = nome;
    document.getElementById('modalEspecialidade').innerText = espec;
    document.getElementById('modalPaciente').innerText = pac;
    document.getElementById('modalResumo').innerText = prontuarios[nome] || "Sem resumo disponível.";
    
    modal.style.display = "block";
};

window.fecharModal = () => {
    const modal = document.getElementById('modalProntuario');
    if (modal) modal.style.display = "none";
};

// Fecha o modal ao clicar fora da área branca
window.onclick = (event) => {
    const modal = document.getElementById('modalProntuario');
    if (event.target === modal) fecharModal();
};

function inicializarPizza() {
    const canvas = document.getElementById('graficoPizza');
    if (!canvas) return;
    
    new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Psicologia', 'Ginecologia', 'Dermatologia', 'Outros'],
            datasets: [{
                data: [40, 25, 20, 15],
                backgroundColor: ['#7c3aed', '#a78bfa', '#ddd6fe', '#f5f3ff'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}