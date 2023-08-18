const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
    res.render("../views/admin/categories/new")
});

router.post("/categories/save", (req, res) => {
    let title = req.body.title;

    if (title != ""){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }
    else{
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("../views/admin/categories/index", {categories: categories});
    });
});


router.post("/categories/delete", (req, res) => {
    let id = req.body.id;

    if (id != undefined){
        if (!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }
        else {
            res.redirect("/admin/categories");
        }
    }
    else{
        res.redirect("/admin/categories");
    }
});

module.exports = router;