const PizzasServices = require("../services/PizzasServices");
const fs = require('fs')
const bcrypt = require('bcrypt');

const AdmController = {
    listarPizzas: (req, res) =>{
        // Carregar as pizzas
        const pizzas = PizzasServices.carregarPizzas();

        // Renderizar a view listar-pizzas, passando as pizzas para ela
        res.render('lista-de-pizzas.ejs', {pizzas})
    },
    criarPizza: (req, res) => {
        res.render('form-add-pizza.ejs');
    },
    gravarPizza: (req, res) => {

        // Quando o form é post os dados ficam no req.body
        // console.log(req.body)

        // Quando o form é get os dados ficam no req.query
        // console.log(req.query);

        // As informações podem vir como parâmetro de rota...
        // console.log(req.params)

        //renomear arquivo
        console.log(req.file);
        let novoNome = `${Date.now()}-${req.file.originalname}`;
        fs.renameSync(req.file.path, `public/img/${novoNome}`);

        let pizza = {
            nome: req.body.nome,
            ingredientes: req.body.ingredientes.split(',').map(e => e.trim()),
            preco: Number(req.body.preco),
            img: `/img/${novoNome}`,
            destaque: false,
            score: 0
        }

        PizzasServices.adicionarPizza(pizza);

        res.redirect('/adm/pizzas');
        
    },
    showEditPizza: (req, res) => {
        // Capiturar o id da pizza a ser editada (req.params)

        // Encontrar a pizza a ser editada guardando na variavel pizza (PizzasServices.carregarPizza)

        // Renderizar a view (ainda inexistente) form-edit-pizza.ejs
        // passando para essa view (res.render(____, {pizza}))
    },

    
    showLogin: (req, res) => {
        res.render('login.ejs');
    },
    login: (req, res) => {
        // res.send(req.body);
        // 1 - Capturar o email e a senha digitados pelo administrador
       const {email, senha}=  req.body;
       

        // 2 - Verificar a existência do administrador.
        // Caso não exista, enviar mensagem de erro
        const administradores = require('../databases/administradores.json');
        let adm = administradores.find(adm =>adm.email === email);
        if(adm === undefined){
           return res.send("falha no login");

        }

        // 3 - Verificar a senha do administrador.
        // Caso senha não seja válida, enviar mensagem de erro
        const senhaOk = bcrypt.compareSync(senha, adm.senha);
        if(!senhaOk){
            return res.send("falha no login");
        }
        // res.send('Login ok ... vamos prosseguir para proximos passos!');


        // 4 - Criar a session/cookie do administrador
        req.session.admLogado =true;


        // 5 - Redirecioná-lo para /adm/pizzas
        res.redirect('/adm/pizzas');


    }



}

module.exports = AdmController;