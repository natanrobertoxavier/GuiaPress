const express = require("express");
const router = express.Router();
const Category = require("../categories/Category")
const Article = require("../articles/Article")
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{
            model: Category
        }]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("../views/admin/articles/new", {categories: categories})
    });
});

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.bodyArticle;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    });
});

router.post("/articles/delete", (req, res) => {
    let id = req.body.id;

    if (id != undefined){
        if (!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }
        else {
            res.redirect("/admin/articles");
        }
    }
    else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id;

    Article.findByPk(id).then(article => {
        if (article.title != ""){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article });
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.update({
        title: title,
        body: body,
        categoryId : category,
        slug: slugify(title)
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

//Paginação 
router.get("/articles/page/:page", (req, res) => {
    let page = req.params.page;
    let offset = 0;
    let amountElements = 4;

    if (isNaN(page) || page == 1){
        offset = 0;
    } else {
        offset = parseInt(page) * amountElements;
    }

    Article.findAndCountAll({
        limit: amountElements,
        offset: offset,
        order: [
            ['id', 'desc' ]
        ]
    }).then(articles => {
        let next = true;

        if (offset + amountElements >= articles.count){
            next = false;
        } else {
            next = true;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result: result, categories: categories});
        });
    });
})

module.exports = router;