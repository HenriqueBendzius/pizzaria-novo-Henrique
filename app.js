// 1 - Importar o express
const express = require('express');
const path = require('path');
const session =require('express-session');

const bloqueiaForaDeHora = require('./middlewares/bloqueiaForaDeHora');
const registraRequisicao = require('./middlewares/registraRequisicao');
const router = require('./router');

// 2 - Criar o servidor
const servidor = express();
servidor.set('view engine','ejs');

// Define a pasta public como sendo a pasta arquivos estáticos
servidor.use(session({
    secret: 'SEGREDO',
    resave: false,
    saveUninitialized: false
}))


servidor.use(express.static(path.join(__dirname, 'public')))
servidor.use(express.urlencoded({ extended: false }));

//configurando o middlewares
servidor.use(registraRequisicao);
servidor.use(bloqueiaForaDeHora);


// 3 - Definir roteador a ser utilizado
servidor.use(router);

// 4 - Por o servidor no modo "aguardando requisição"
servidor.listen(3000);