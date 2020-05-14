const jwt = require('jsonwebtoken'); 

//====================
//Verificacion de token
//================

let VerificacionToken = (req, res, next) => {
    
    let token = req.get('token',);
    jwt.verify( token, process.env.SEED, (err, decoded )=>{
        
        if( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    messages: 'Token no valido'
                }
            });
        }
        req.usuario =decoded.usuario;
        next();     
    });
    
};//  NOTA: sí se hacen modificaciones en un campo del usuario con el que se genero el TOKEN, hay que Volverlo a generar de nuevo  payload por que si no el PAYLOAD   seguira comparando con el token antiguo, no basta con cambiar un campo en la Base de datos(CASOS DONDE ESTO OCURRE)[Querer hacer DELETE, POST, PUT con un token que no era ADMIN_ROLE].

// ===================================
    // Verifica ADMIN_ROL
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE'){
        next(); //regresa control a routes/usuarios
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'Elusuario no es administrador'
            }
        }); // No pasara al siguiente codigo mientras no se llama al NEXT aun que tenga el RETUR
    }
}

module.exports= {
    VerificacionToken, 
    verificaAdmin_Role
}