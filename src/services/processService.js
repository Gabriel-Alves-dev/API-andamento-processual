const axios = require('axios');
const apiUrls = require('../../config/apiUrls'); // Ajuste o caminho conforme necessário
const formatDateTime = require('../utils/formatDateTime');

const apiKey = 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=='; // Usar variáveis de ambiente para segurança

const headers = {
    'Authorization': apiKey,
    'Content-Type': 'application/json'
};

const getProcessStatus = async (numeroProcesso) => {
    const payload = {
        query: {
            match: { "numeroProcesso": numeroProcesso }
        }
    };

    for (const url of apiUrls) {
        try {
            const response = await axios.post(url, payload, { headers });
            if (response.data && response.data.hits && response.data.hits.hits.length > 0) {
                const processo = response.data.hits.hits[0]._source;

                processo.dataHoraUltimaAtualizacao = formatDateTime(processo.dataHoraUltimaAtualizacao);
                processo.movimentos = processo.movimentos || [];

                processo.movimentos = processo.movimentos.map(mov => ({
                    nome: mov.nome,
                    dataHora: formatDateTime(mov.dataHora),
                    complementosTabelados: mov.complementosTabelados || []
                }));

                return processo;
            }
        } catch (error) {
            console.error(`Erro ao consultar a URL ${url}:`, error.message);
        }
    }
    return null;
};

module.exports = { getProcessStatus };
