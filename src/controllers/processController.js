const { getProcessStatus } = require('../services/processService');
const Joi = require('joi');

const consultaProcesso = async (req, res) => {
    // Validação do número do processo
    const schema = Joi.object({
        numeroProcesso: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let { numeroProcesso } = value;

    try {
        // Limpar o número do processo removendo pontos e traços
        numeroProcesso = numeroProcesso.replace(/[.\-]/g, '');

        // Obter os dados do processo
        const dadosProcesso = await getProcessStatus(numeroProcesso);

        if (!dadosProcesso) {
            return res.status(404).json({ success: false, message: 'Processo não encontrado.' });
        }

        // Formatar dataHoraUltimaAtualizacao
        const ultimaAtualizacao = dadosProcesso.dataHoraUltimaAtualizacao.replace(', / ', ' - ');

        // Formatar dataAjuizamento
        const dataAjuizamento = new Date(dadosProcesso.dataAjuizamento).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        }).replace(',', ' -');

        // Ordenar os movimentos por dataHora (assumindo que estão em ordem crescente)
        const movimentosOrdenados = dadosProcesso.movimentos.sort((a, b) => {
            const dateA = new Date(a.dataHora.split(', / ')[0].replace('-', '/'));
            const dateB = new Date(b.dataHora.split(', / ')[0].replace('-', '/'));
            return dateB - dateA; // Ordem decrescente
        });

        // Pegar os últimos 4 andamentos
        const ultimosAndamentos = movimentosOrdenados.slice(0, 4).map(movimento => {
            const dataHora = movimento.dataHora.replace(', / ', ' - ');
            const complementos = movimento.complementosTabelados.length > 0
                ? movimento.complementosTabelados.map(c => c.nome).join(', ')
                : 'sem complementos';
            return `${dataHora}: ${movimento.nome}, ${complementos}`;
        });

        // Montar a resposta formatada
        const respostaFormatada = {
            success: true,
            processo: {
                numeroProcesso: dadosProcesso.numeroProcesso,
                classe: dadosProcesso.classe.nome,
                dataAjuizamento: dataAjuizamento,
                tribunal: dadosProcesso.tribunal,
                ultimaAtualizacao: ultimaAtualizacao,
                movimentacoes: ultimosAndamentos
            }
        };

        res.json(respostaFormatada);

    } catch (error) {
        console.error('Erro ao consultar processo:', error);
        res.status(500).json({ success: false, message: 'Erro ao consultar processo.' });
    }
};

module.exports = { consultaProcesso };
