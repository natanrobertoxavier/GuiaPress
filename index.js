const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const CategoriesController = require("./categories/CategoriesController.js");
const ArticlesController = require("./articles/ArticlesController.js");

const Article = require("./articles/Article");
const Category = require("./categories/Category");


//Carregamento view engine
app.set('view engine', 'ejs');

//Arquivos statics
app.use(express.static('public'));

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso");
    }).catch((error) => {
        console.log(error);
    });

//Body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Rotas
app.use("/", CategoriesController);
app.use("/", ArticlesController);

app.get("/", (req, res) => {
    Article.findAll().then(articles => {
        res.render("index", {articles: articles});
    })
})

app.listen(8080, () => {
    console.log("O servidor está rondando!")
})