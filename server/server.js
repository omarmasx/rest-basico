// npm install --save bcryptjs && npm uninstall --save bcrypt
require('./config/config');
const mongoose = require('mongoose');
 
const express = require('express');
const app = express();

const bodyParser = require('body-parser');    // esta linea se puede meter en aArchivo de CONFIG.JS PERO LO DEJAREMOS AQUI PARA QUE VEAN RApidamente que necesita server

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))   

// parse application/json
app.use(bodyParser.json())

    // SUSUTITUIMOS VARIAS RUTAS POR UN DOCUMENTO QUE CONTENGA TODAS ELLAS DANDO MEJOR PRESENTACION ESTE SERA index.js
// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));
app.use(require('./routes/index'));      // configuracion global de rutas


        //  process.env.URLdb (variable de desarrollo que establece la coneccion local o remota  esta en config.js)  
        // valiadacion de opciones actuales para evitar la Deprecation Warnings(advertencias de desaprobacion)
mongoose.connect( process.env.URLdb,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },(err,resp) =>{
    if( err) throw err;
console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});

//password: bcrypt.hashSync(body.password,10);//dta a almacenar , numeor de vueltas aplicadas a este hash