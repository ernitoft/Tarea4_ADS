const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // Ruta al archivo SQLite
});

module.exports = sequelize;
