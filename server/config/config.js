// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
    process.env.NODE_ENV = process.env.NODE_ENV || 'dev'   //variable establecida en heroku o dev de desarrollo

// ============================
//  Vencimiento del token
// ============================
//60 segundo 
//60 minutos
//24 horas
//30 dias      toquen con vigencia de un mes
process.env.CADUCIDAD_TOKEN = 1000* 60 * 60 * 24 *30;//ms, s, m, h,d

// ============================
//  SEED (semilla) de autenticacion
// ============================
process.env.SEED = process.env.SEED || 'este es el seed de desarrollo'; //process.env.SEED === variable de Heroku(producccion) O si no de desarrollo     
                                                                        //VER IMAGEN 122 variable de entorno heroku


// ============================
//  Base de datos
// ============================
        //local//
    let urlDB;
    if(process.env.NODE_ENV === 'dev' ){
            // local
        urlDB = 'mongodb://localhost:27017/cafe';
    }else{
            //remota(nube)//   PARAMETROS CONNECT APLICATION FOR URI ENCODED =>    //userDB:cafe-user      passDB:12345678910      Database:cafe   Collection:usuario
                                
                 //mongodb+srv://strider:<password>@cluster0-qhnym.mongodb.net/test?retryWrites=true&w=majority  
        urlDB = process.env.MONGO_URI;// variable de heroku      
    }
    //Si comento las lineas: 18-22  y la 27 puedo hacer prueba de DB remota(mongo DB Atlas)
    
    process.env.URLdb = urlDB;  
    
    // ===================
    // Google Client ID
    // ===================
    process.env.CLIENT_ID = process.env.CLIENT_ID || '668908998277-nvf4vfja7id29062fj1f46269logprmq.apps.googleusercontent.com';

