//encargado de trabajar el modelo de datos
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//plugin que pide definir el campo unico en este caso email

// obtener el cascaron de mongoose
let Schema = mongoose.Schema; //Y asi borra el campo de la contraseña al reenviar los datos

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

//definiendo reglas y controles que el esquema tendra
let usuarioSchema = new Schema({
    nombre: {
        type: String,//tipo que sera nombre
        required: [true, 'El nombre es necesario'] //obligatorio[true, endado caso que FALSE mandar msg]
    },
    email:{
        type: String,
        unique: true,// no admitira duplicado de keys   uniqueValidator
        required: [true, 'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE', 
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default: false
     }
});



// toJSON=== Este metodo se llama en un Schema cuando se intenta imprimir, ver documentacion npm toJSON, mostrara las diferencias al imprimir un objeto modificado;1°toObject, 2°eliminar un campo del obj con toJSON y el formato de toJSON stringify.

//  una forma que podemos esconder la clave es acceso a campo password de BD poniendolo a null del objeto linea 33 de routes/userjs , pero seguiria viendo el campo el ususario por ende accedemos accedemos al objeto y eliminamos el campo antes de enviarlo al ususario como se aprecia en las lineas de la funcion de abajousuarioSchema.methods.toJSON 
// (QUITAR EL PASSWORD CADA VEZ QUE EL OBJETO QIERA PASARSE A JSON)
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject(); //tomar el obj teniendo todas las propiedades y metodos
    delete userObject.password; //Aqui si podemos llamar DELET  pues es parte de las propiedades de MONGO
    //sin el return ya no sale todo el OBJ

    return userObject;
}

//uso del plugin en el eschema
usuarioSchema.plugin( uniqueValidator, { message : '{PATH} debe de ser unico'} ); //{PATH} === email

module.exports = mongoose.model('Usuario', usuarioSchema); //nombre del OBJ Ususario  y tendra la configuracion de ususarioSchema
