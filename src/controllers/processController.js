const { getProcessStatus } = require('../services/processService');
const Joi = require('joi');

const consultaProcesso = async (req, res) => {
    const schema = Joi.object({
        numeroProcesso: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { numeroProcesso } = value;

    try {
        const processo = await getProcessStatus(numeroProcesso);
        if (processo) {
            res.json({ success: true, processo });
        } else {
            res.json({ success: false, message: 'Processo não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao consultar processo:', error);
        res.status(500).json({ success: false, message: 'Erro ao consultar processo.' });
    }
};

module.exports = { consultaProcesso };
