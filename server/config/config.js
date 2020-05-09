// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
        //variable establecida en heroku
    process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


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
    