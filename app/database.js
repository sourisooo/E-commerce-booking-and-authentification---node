const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:random@localhost/shoppingcart', {
    // logging false pour ne pas polluer le terminal avec les requêtes
    // si on veut voir les requêtes, il faut enlever cette ligne
    // logging: false,
    define: {
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    },
});

module.exports = sequelize;
