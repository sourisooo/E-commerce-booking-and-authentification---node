const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Product extends Sequelize.Model {}
/**
 * Voici les champs nécessaires pour faire le Model
 * category_id int
 * ref string
 * image string
 * title string
 * description text
 * price number
 * tableName: 'products',
 */

Product.init(
    {
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
    
        },
        ref: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
      
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,

        },
        price: {
            type: DataTypes.NUMBER,
            allowNull: false,
  
        },
    },

    
    {
        sequelize,
        tableName: 'products',
    }
);


module.exports = Product;
