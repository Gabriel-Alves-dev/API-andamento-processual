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
 *                 example: "1234567-89.2023.8.26.0100"
 *     responses:
 *       200:
 *         description: Retorna os detalhes do processo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 processo:
 *                   type: object
 *       400:
 *         description: Requisição inválida.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/consulta-processo', authenticate, consultaProcesso);

module.exports = router;
