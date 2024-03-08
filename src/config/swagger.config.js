import swaggerJsdoc from 'swagger-jsdoc';
import {API_PREFIX, API_URL, DEVELOPMENT_SERVER_URL, PORT, PRODUCTION_SERVER_URL} from "../constants/environment.js";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Swagger Presentation App',
            version: '1.0.0',
            description: 'API documentation for Swagger Presentation App',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: `${API_URL}:${PORT}${API_PREFIX}`,
                description: 'Development server',
            },
            {
                url: `${PRODUCTION_SERVER_URL}${API_PREFIX}`,
                description: 'Production server',
            },
        ],
    },
    apis: ['./src/routes/*.js','./src/models/*.js'],
};

const specs = swaggerJsdoc(options);

async function configureSwagger(app) {
    // Swagger UI on backend
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

    // Docs in JSON for frontend
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(specs);
    });

    console.log(`Docs available at ${API_URL}:${PORT}/api-docs`);
}

export default configureSwagger;