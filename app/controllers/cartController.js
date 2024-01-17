const Product = require('../models/Product');

const cartController = {
    index: (req, res) => {
        res.render('cart');
    },

  
};

module.exports = cartController;
