const { Category, Product } = require('../models');

const catalogController = {
    index: async (req, res) => {
        res.render('index');
    },

    productsList: async (req, res) => {
        try {
            // todo, ici il faudra les vrais produits et catégories de la db
            const products = await Product.findAll({

                include: [{


                    association: 'categories',

                }]

            });


            const categories = await Category.findAll({

                include: [{


                    association: 'products',


                }]

            });

            // console.log(categories,products);

            res.render('shop', { 
                categories,
                products 
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    },

    category: async (req, res) => {
        // todo, il faut récupérer la catégorie en fonction de l'id présent dans l'url et la passer à la vue

        const {id} = req.params;

        const cats = await Category.findByPk(id, {

            include: [{

                association: 'products',


            }]

        })

        // console.log(JSON.stringify(cats));

        res.render('category', {cats});
    },

    product: async (req, res) => {
        // todo, récupérer le produit demandé en base de données.

        const {id} = req.params;

        const prod = await Product.findByPk(id, {

            include: [{

                association: 'categories',


            }]

        })

        // console.log(prod);

        res.render('product', {prod});
    },

    cart: (req, res) => {
        res.render('cart');
    },
};

module.exports = catalogController;
