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
    Article.findAll({
        order: [
            ['id', 'desc' ]
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        })
    })
})

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article.title != ""){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        } else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
})

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category.title != ""){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            })
        } else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.listen(8080, () => {
    console.log("O servidor está rondando!")
})