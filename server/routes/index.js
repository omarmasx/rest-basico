const express = require('express');
const app = express();

// LUGAR DE TOTAS LA RUTAS
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;