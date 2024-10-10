const express = require('express');
const processRoutes = require('./src/routes/processRoutes');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config(); // Carregar variáveis de ambiente

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Helmet para segurança HTTP
app.use(helmet());

// Configuração do CORS
app.use(cors({
    origin: 'https://andamento-processual-bmd.shop', // Domínio do bot
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuração do Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: { success: false, message: 'Muitas requisições de um único IP, por favor tente novamente mais tarde.' }
});
app.use(limiter);

// Parse de JSON
app.use(express.json());

// Rotas da API
app.use('/api', processRoutes);

// Configuração do Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Consulta de Processos',
            version: '1.0.0',
            description: 'API para consultar o andamento processual.'
        },
        servers: [
            {
                url: `https://andamento-processual-bmd.shop` // Seu domínio
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js'], // Caminho para os arquivos de rota
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rota para verificar se a API está funcionando
app.get('/', (req, res) => {
    res.send('API de Consulta de Processos está funcionando.');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
