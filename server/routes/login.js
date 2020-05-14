const express = require('express');
const bcrypt = require('bcryptjs');// como no se pudo usar bcrypt ymportamos bcryptjs
const jwt = require('jsonwebtoken');  //Generara Token
const Usuario = require('../models/usuario');//mongoose
const app = express();

app.post('/login', (req, res)=>{
    
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB)=>{
       
        if(err){
                        //500 error interno del servidor
           return res.status(500).json({
               ok: false,
               err
           });
       } 
    
        if( !usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'USUARIO o contraseña incorrectos'
                }
            });
        }

        if( !bcrypt.compareSync( body.password, usuarioDB.password ) ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o CONTRASEÑA incorrectos'
                }
            });
        }

        
        // llamas al metodo que compara la firma (sing)     // El token se compone de 3 partes (HEADER:ALGORITHM & TOKEN TYPE se uso("alg": "HS256), PAYLOAD:DATA a incriptar , VERIFY SIGNATURE)
        let token = jwt.sign( { 
            usuario: usuarioDB
            }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN } ); //generara token(data en formato OBJ, cadena de firma, caducidad[seg,min,horas, dias] )   //CONFIRMACION DE TOKEN EN    https://jwt.io/

        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        });

    });
});

module.exports = app;