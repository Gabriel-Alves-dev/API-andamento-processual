const express = require('express');
const { consultaProcesso } = require('../controllers/processController');
const authenticate = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/consulta-processo:
 *   post:
 *     summary: Consulta o andamento de um processo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroProcesso:
 *                 type: string
 *                 example: "8010554-34.2023.8.05.0001"
 *     responses:
 *       200:
 *         description: Retorna os detalhes do processo formatados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 processo:
 *                   type: object
 *                   properties:
 *                     numeroProcesso:
 *                       type: string
 *                     classe:
 *                       type: string
 *                     dataAjuizamento:
 *                       type: string
 *                     tribunal:
 *                       type: string
 *                     ultimaAtualizacao:
 *                       type: string
 *                     movimentacoes:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Requisição inválida.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Processo não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/consulta-processo', authenticate, consultaProcesso);

module.exports = router;
