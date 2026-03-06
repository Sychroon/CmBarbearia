// ===========================================
// PROGRAM.JS - JavaScript Unificado do Site
// ===========================================

/* ======================================================
   BLOCO 1 — CONTROLE DO MODAL DE AGENDAMENTO
   ====================================================== */

/**
 * Abre o modal de agendamento
 */
function abrirModal() {
    const overlay = document.getElementById('agendamentoModal');
    if (overlay) overlay.style.display = 'flex';
}

/**
 * Fecha o modal de agendamento
 */
function fecharModal() {
    const overlay = document.getElementById('agendamentoModal');
    if (overlay) overlay.style.display = 'none';
}

/**
 * Permite fechar o modal ao clicar fora do card
 */
function overlayClickHandler(e) {
    if (e.target.id === 'agendamentoModal') {
        fecharModal();
    }
}

// Listeners do modal
document.addEventListener('click', overlayClickHandler);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharModal();
});


/* ======================================================
   BLOCO 2 — VALIDAÇÃO DE DATA/HORA
   (UNIFICADO DO form-validation.js)
   ====================================================== */

/**
 * Valida se a data e hora são futuras
 * Também verifica horário de atendimento e limite de 7 dias
 */
function validateDateTime() {
    const dateEl = document.getElementById('data');
    const timeEl = document.getElementById('hora');

    if (!dateEl || !timeEl) return true;

    const dateVal = dateEl.value;
    const timeVal = timeEl.value;

    if (!dateVal || !timeVal) return true;

    const now = new Date();
    const selected = new Date(dateVal + 'T' + timeVal);

    if (isNaN(selected.getTime())) return true;

    // Data não pode ser no passado
    if (selected < now) {
        alert('Data e horário devem ser futuros.');
        return false;
    }

    // Limite de 7 dias para agendar
    const limite = new Date();
    limite.setDate(limite.getDate() + 7);

    if (selected > limite) {
        alert('O máximo para agendamento é de 7 dias a partir de hoje.');
        return false;
    }

    // Verificar horário de atendimento por dia da semana
    const diaSemana = selected.getDay();
    const hora = selected.getHours();
    const minuto = selected.getMinutes();
    const horaDecimal = hora + (minuto / 60);

    let abertura, fechamento;

    if (diaSemana === 0) {
        // DOMINGO
        abertura = 10;
        fechamento = 14;
    } else {
        // SEGUNDA A SÁBADO
        abertura = 9;
        fechamento = 21;
    }

    if (horaDecimal < abertura || horaDecimal >= fechamento) {
        alert('Fora do horário de atendimento.');
        return false;
    }

    return true;
}

// Exporta para escopo global
window.validateDateTime = validateDateTime;


/* ======================================================
   BLOCO 3 — INICIALIZAÇÃO DO SITE
   (executa quando o HTML termina de carregar)
   ====================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /**
     * Calcular valor total dos serviços selecionados
     */
    function calcularTotal() {
        let total = 0;

        document.querySelectorAll('input[name="servicos"]:checked').forEach(cb => {
            const preco = parseFloat(cb.getAttribute('data-preco')) || 0;
            total += preco;
        });

        const totalEl = document.getElementById('totalValue') || document.getElementById('total-value');

        if (totalEl) {
            totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
        }
    }

    /**
     * Filtro de categoria dos serviços
     */
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos os botões
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));

            // Adiciona active ao botão clicado
            btn.classList.add('active');

            // Descobre qual categoria foi clicada
            const categoria = btn.getAttribute('data-categoria');

            // Mostra/oculta serviços conforme a categoria
            document.querySelectorAll('.servico-item').forEach(servico => {
                if (categoria === 'todos' || servico.getAttribute('data-categoria') === categoria) {
                    servico.style.display = 'flex';
                } else {
                    servico.style.display = 'none';
                }
            });
        });
    });

    /**
     * Atualizar total quando marcar/desmarcar serviço
     */
    document.addEventListener('change', function (e) {
        if (e.target && e.target.name === 'servicos') {
            calcularTotal();
        }
    });

    /**
     * Botões que abrem o modal (nav e hero)
     */
    const navBtn = document.getElementById('openAgendarNav');
    const heroBtn = document.getElementById('openAgendarHero');

    if (navBtn) {
        navBtn.addEventListener('click', function (e) {
            e.preventDefault();
            abrirModal();
        });
    }

    if (heroBtn) {
        heroBtn.addEventListener('click', function (e) {
            e.preventDefault();
            abrirModal();
        });
    }

    /**
     * Gerar resumo do agendamento para enviar
     */
    function gerarResumoAgendamento() {
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;

        const servicosSelecionados = [];

        // pega todos os checkboxes marcados
        document.querySelectorAll('input[name="servicos"]:checked').forEach(cb => {
            const item = cb.closest('.servico-item');
            if (item) {
                const nomeServico = item.querySelector('h4');
                if (nomeServico) {
                    servicosSelecionados.push(nomeServico.textContent.trim());
                }
            }
        });

        const totalEl = document.getElementById('totalValue') || document.getElementById('total-value');
        const total = totalEl ? totalEl.textContent : 'R$ 0,00';

        const resumo =
            `Novo agendamento

Nome: ${nome}
Telefone: ${telefone}
Data: ${data}
Hora: ${hora}

Serviços:
${servicosSelecionados.join('\n')}

Valor total: ${total}`;

        return resumo;
    }

    /**
     * Enviar agendamento para WhatsApp
     */
    function enviarParaWhatsApp() {
        const numero = "5521990038535"; // 55 + DDD + número

        const mensagem = gerarResumoAgendamento();
        const mensagemCodificada = encodeURIComponent(mensagem);
        const url = `https://wa.me/${numero}?text=${mensagemCodificada}`;

        window.open(url, "_blank");
    }

    /**
     * Envio/submit do formulário
     */
    const form = document.getElementById('agendamentoForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Captura valores digitados
            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const data = document.getElementById('data').value;
            const hora = document.getElementById('hora').value;

            // Validação básica
            if (!nome || !telefone || !data || !hora) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Verifica data/hora futura
            if (typeof validateDateTime === 'function' && !validateDateTime()) {
                e.preventDefault();
                return;
            }

            // Verifica se pelo menos um serviço foi selecionado
            const selecionados = document.querySelectorAll(
                '.servico-item input[type="checkbox"]:checked'
            );

            if (selecionados.length === 0) {
                alert('Por favor, selecione pelo menos um serviço.');
                return;
            }

            // Agendamento válido - enviar para WhatsApp
            enviarParaWhatsApp();

            // Limpa e fecha
            form.reset();
            calcularTotal();
            fecharModal();
        });
    }

    /**
     * Estado inicial do filtro (mostra todos os serviços)
     */
    const firstBtn = document.querySelector('.categoria-btn[data-categoria="todos"]');
    if (firstBtn) firstBtn.click();

});