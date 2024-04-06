const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { generateToken, authenticateToken } = require('./auth');
const { register, login, logOut, dataSync, getBalances, securityCode    } = require('./controller')
const {raw} = require("express");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['*.js'],
};


const app = express();
app.use(express.json());

const users = [];

app.post('/register', async (req, res) => {
    await register(req, res)
});

app.post('/login', async (req, res) => {
await login(req, res)
});

app.post('/logout',authenticateToken, (req, res) => {
    logOut(req, res)
});

app.get('/protected', authenticateToken, (req, res) => {
    securityCode(req, res)
});


app.get('/api/data',authenticateToken, async (req, res) => {
    await dataSync(req, res)
});

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/balance/:address',authenticateToken, async (req, res) => {
    await getBalances(req, res)
})

app.listen(8000, () => {
    console.log('Server running on port 8000');
});
