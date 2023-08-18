const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//RELACIONAMENTOS DE ENTIDADES (NA BASE DE DADOS)
Category.hasMany(Article);    //1 PARA MUITOS - HASMANY
Article.belongsTo(Category);  //1 PARA 1 - BELONGSTO

//CRIAÇÃO DAS TABELAS NO BANCO DE DADOS
//COMENTADA PORQUE JÁ ESTÁ CRIADA
// Article.sync({
//     force: true
// });

module.exports = Article;