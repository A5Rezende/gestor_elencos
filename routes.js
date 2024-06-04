const express = require('express');
const route = express.Router();

const indexController = require('./src/controllers/inicio');
const loginController = require('./src/controllers/login');
const elencoController = require('./src/controllers/elenco');
const jogadorController = require('./src/controllers/jogador');

const { loginRequired } = require('./src/middlewares/middleware');

// Inicio
route.get('/', indexController.inicio);

// Rotas de Login
route.get('/login', loginController.inicio);
route.post('/login/login', loginController.login);
route.post('/login/cadastro', loginController.cadastro);
route.get('/login/logout', loginController.logout);

// Elenco
route.get('/elenco', loginRequired, elencoController.inicio);
route.get('/elenco/delete/:id', loginRequired, jogadorController.remover);

// Base
route.get('/base', loginRequired, elencoController.inicio);
route.get('/base/delete/:id', loginRequired, jogadorController.remover);

// Compras
route.get('/compras', loginRequired, elencoController.inicio);
route.get('/compras/delete/:id', loginRequired, jogadorController.remover);

// Vendas
route.get('/vendas', loginRequired, elencoController.inicio);
route.get('/vendas/delete/:id', loginRequired, jogadorController.remover);

// Jogadores
route.get('/jogador', loginRequired, jogadorController.inicio);
route.post('/jogador/adiciona', loginRequired, jogadorController.adicionar);
route.get('/jogador/index/:id', loginRequired, jogadorController.editaIndex);
route.post('/jogador/edita/:id', loginRequired, jogadorController.editar);

module.exports = route;
