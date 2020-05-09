// npm install --save bcryptjs && npm uninstall --save bcrypt
require('./config/config');
const mongoose = require('mongoose');
 
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

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