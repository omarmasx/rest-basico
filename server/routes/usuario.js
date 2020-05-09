const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');// como no se pudo usar bcrypt ymportamos bcryptjs
const _= require("underscore");
const Usuario = require('../models/usuario');//mongoose

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0; // variable de filtrado de paginacion, si no esta asignar cero
    desde = Number(desde);
    let limite = req.query.limite || 5;//filtrado de reg. a mostrar
    limite = Number(limite);

    // res.json('get Usuario LOCAL!!!');  //depuracionantes de BD
    
    // Consulta de mongose (mostrar todo el documento de BD)
    Usuario.find( { estado:true } ,  'nombre email role estado google img')// 2° parametro son los campos o prop. que queremos mostrar+id ( 'nombre email role estado google img')
                    //estado:true es para no eliminarlos de la BD y filtrarlos por esta condicion asi ya no se accedera a el como si estuviera borrado de la BD aun que en la BD seguira presente, asi es como trabajan las BD reales
            .skip(desde)    //saltarse los primeros 'desde' registros
            .limit(limite)   //muestra los sig.  registros
            .exec( (err, usuarios ) => {
                
                if( err){
                    return res.status(400).json({
                        ok: false,
                        err //err:err   notacion simplificada
                    });
                }

                // contar el # de registros
                Usuario.countDocuments( { estado:true }, (err, conteo) => { // Usuario.count( { google:true}, (err, conteo)   arrojaria cero en este momento por la condicion que no hay registros de google
                    //DEPRECATION WARNING
                // Usuario.count( { estado:true }, (err, conteo) => { // Usuario.count( { google:true}, (err, conteo)   arrojaria cero en este momento por la condicion que no hay registros de google
                    
                    res.json({
                        ok:true,
                        usuarios,
                        cuantos:conteo
                    });
                }); //1°parametro condicion de busqueda, 2° callback

            }) // ejecuta el find pero como promesa ademas que hace uso de 2 parametros (err, resultado de la ejecucion)

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });//OBJ, INSTACIADO DE  SCHEMA models/ususario con todas sus prop. y metodos de mongoose
//      password: body.password,


    //grabacion en BD con funcion de mongoose,  al grabar puede regresar un 'error' o la respuesta del ususario que se grabo en mongo==='usuarioDB' 
    usuario.save( (err, usuarioDB) =>{

        if( err){
            return res.status(400).json({
                ok: false,
                err //err:err   notacion simplificada
            });
        }

        // ususarioDB.password = null;      //manera diferente de no enviar la contraseña al front en la respuesta DE usuarioSchema.methods.toJSON que esta en models/usuario.js  
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//ruta:usuario/algo bautizado como el aleas id          ===> {{url}}/usuario/5eb1e62bf953ae13d0e2da63
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    // let body = req.body;
    // delete req.body.password; delete req.body.google;   //se eliminaban para no tener acceso a modificarlos, otra forma de trabajar con dichas claves es la del renglon de abajo
    let body =_.pick(req.body, ['nombre','email', 'img', 'role', 'estado' ] );//parametros :objeto que tiene todas propiedades, arreglo con todas las propiedades validas       pick =>Return a copy of the object, filtered to only have values for the whitelisted{en la lista blanca} keys (or array of valid keys)

    // actualizar findByAndUpdate show console que sera descontinuada pronto en la sigiente version de mongose
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true } ,(err,usuarioDB) => {
    //body es el obj con los parametros a actualizar
    //la opcion pasada por parametro({new: true}) ,permite pasar la actualizacion del ususario y no el ususario que estaba antes de que se modificara  (hablo de ususarioDB antes y despues de la modificacion ACTUALIZACION ) 
    //opcion: runValidaitor:true; ejecuta validadores de actualización que estan definidos en el Schema, si opcion esta a false permitira poner un valor distinto al definido == rolesValidos = {values: ['ADMIN_ROLE','USER_ROLE'],    message: '{VALUE} no es un rol valido'   }
    //libreria underscorejs usaremos el Objeto PICK, ayuda en no modificar parametros no deseados del documento de la BD como pueden ser password, google, etc    En vez de delete body.password, delete body.google, etc que estarian despues de la linea let body = req.body; ()45        

        if( err){
            return res.status(400).json({
                ok: false,
                err 
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB     
        });                         
                                    
    });

    
});


app.delete('/usuario/:id', function(req, res) {

    let idObj = { _id:req.params.id}; // Mongose.prototype.ObjId
    let cambiaEstado = { estado:false };

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{          // Si se activa esta linea  y se eliminan las 109 y 110 se borrara el DOCUMENTO de la BD en vez de que se camvie la clave de ESTADO a FALSE
        Usuario.findOneAndUpdate(idObj,cambiaEstado, { new:true }, (err,usuarioBorrado )=> {   //
    
        //valida que no exista un erro cuando se hace una busqueda en lso documentos de la BD
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        //EVALUA SI EN EL CALL BACK VIENE UN USUARIO BORRADO (valida que ya se ha borrado el ususario  y este sera igual a null por que sus campos fueron borrados, mas no es un error al buscar el documento por id)
        if(usuarioBorrado === null){        // 'usuarioBorrado === null'  es igual '!ususarioBorrado'
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            });
        }

        // envia el ususario que se borro
        res.json({
            ok:true,
            ususario: usuarioBorrado
        });

    });
});

module.exports = app;