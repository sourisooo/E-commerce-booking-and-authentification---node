const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database.js');
const Role = require('./Role.js');

class Session extends Sequelize.Model {}

Session.init(
    {

        panier: {
            type: DataTypes.TEXT,

  
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'sessions',
    }
);

//User.belongsTo(Role(), { foreignKey: 'role_id' });

module.exports = Session;
