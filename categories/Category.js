const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//CRIAÇÃO DAS TABELAS NO BANCO DE DADOS
//COMENTADA PORQUE JÁ ESTÁ CRIADA
// Category.sync({
//     force: true
// });

module.exports = Category;