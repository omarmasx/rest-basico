const express = require('express');
const bcrypt = require('bcryptjs');// como no se pudo usar bcrypt ymportamos bcryptjs
const jwt = require('jsonwebtoken');  //Generara Token

const {OAuth2Client} = require('google-auth-library'); //verica la integridad del token
const client = new OAuth2Client(process.env.CLIENT_ID); // crea instancia dle cliente_ID

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




// ===============CONFIGURACIONES DE GOOGLE =============================================================================
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);  console.log(payload.email);  
    
    // OBJETO definido por parametros de google
    return {
        nombre: payload. name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async (req, res ) =>{
    let token = req.body.idtoken;
    console.log(token);

    let googleUser = await verify( token )
                    .catch( e=> {
                        return res.status(403).json({
                            ok: false,
                            err: e
                        })
                    })

    // res.json({
    //     usuario: googleUser
    // })

    // Hiendo a la BD for validations       // GO TO DATA BASE od google AND MAKE VALIDATION
    Usuario.findOne( {email: googleUser.email}, (err, usuarioDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
    
        if( usuarioDB ) {
            if( usuarioDB.google === false ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su aautenticacion normal por APP y NO pot GOOGLE'
                    }
                });
            }else {
                //renovacion de token
                //panorama donde si se ha autenticado por google
                 // llamas al metodo que compara la firma (sing)     // El token se compone de 3 partes (HEADER:ALGORITHM & TOKEN TYPE se uso("alg": "HS256), PAYLOAD:DATA a incriptar , VERIFY SIGNATURE)
                let token = jwt.sign( { usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN} );
                
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        
        }else{
            //si el ususario no existe en nuestra BD, se creara
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; // // ponemos el campo ya que en la DB es obligatorio, y no importa tanto este simbolo asignado ya que el ususario no podra verlo ya que sera encriptado, los usuarios no veran este caracter debido a que esta encryptado
            //GRAVACION DE LA BD
            usuario.save( (err, usuarioDB ) => {
    
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
    
                //renobar token
                let token = jwt.sign( { usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN} );
                
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
    
            });
        }

    })



});//POST: google

module.exports = app;
  
  