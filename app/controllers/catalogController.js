
const { where } = require('sequelize');
const { Category, Product, Session, User } = require('../models');


let products = [];

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

    addcart: async (req, res) => {

        const {id} = req.params;

        const prod = await Product.findByPk(id, {

            select: ['id'],

            include: [{

                association: 'categories',


            }]

    
        }); 
        
        // console.log(prod.dataValues);


        // console.log(typeof req.session.cart);

        if ((products.lenght=1)&&(req.session.user)&&(req.session.cart != null)){

            req.session.cart.push(prod.dataValues);

            products = req.session.cart

        } else if((req.session.user)){
 
            products.push(prod.dataValues);
    
            req.session.cart = products;
    


        } else if ((!req.session.user)&&(products != undefined)&&(req.session.cart == undefined)){


            console.log(products);

            console.log(req.session.cart);

            products= [];

            products.push(prod.dataValues);

            req.session.cart = products;

        } else if ((!req.session.user)){

            products.push(prod.dataValues);

            req.session.cart = products;

        }


        // console.log(req.session.cart);

        const prodsession = await Product.findOne({
            where: { id: id },
            attributes: { exclude: ['category_id', 'ref', 'image', 'title', 'description', 'price', 'created_at', 'updated_at'], include: ['id'] },
          }); 


          if (req.session.user) {


        const sessionupdate = await Session.findOne({where:{user_id: req.session.user.id}});

        //   console.log(sessionupdate);

          if (sessionupdate) {

        let panierString = JSON.stringify(prodsession);

        sessionupdate.panier=`${sessionupdate.panier}, ${panierString}`;

        // console.log(sessionupdate.panier);

        sessionupdate.save();} else {
            
            await Session.create({

                panier: prodsession.dataValues.id,
                user_id: req.session.user.id,
            
              }); 
        

             };}

        res.redirect('/cart');


    },     remove: async (req, res) => {

        const {id} = req.params;

        // const productId = parseInt(req.params.productId);

    
        const productsInCart = req.session.cart;

        const newProducts = productsInCart.filter(
            prod => prod.id != id
        );

        // console.log(newProducts);

        // console.log(req.session.cart);

        products = newProducts;

        req.session.cart = newProducts;

        if (req.session.user) {

        const sessionupdate = await Session.findOne({where:{user_id: req.session.user.id}});

        let remove = `{"id":${id}}`;

        if(sessionupdate.panier != null) {

        let panierupdated = sessionupdate.panier.replaceAll(remove, '').replaceAll(' , ', '').replaceAll(',,', '').replaceAll('null,', '');

        sessionupdate.panier = panierupdated;

        sessionupdate.changed('panier', true);

        sessionupdate.save();}}

        // console.log(panierupdated);

        // console.log(sessionupdate);


        res.redirect('/cart');

    },   destroy: async (req, res) => {
   
        req.session.cart = [];
        products = [];
        res.locals.cart = req.session.cart;

        if (req.session.user){

        const sessionupdate = await Session.findOne({where:{user_id: req.session.user.id}});

        sessionupdate.panier = '';

        console.log(sessionupdate.panier);

        sessionupdate.changed('panier', true);

         sessionupdate.save();
        
        }

        res.redirect('/cart');
    },




};

module.exports = catalogController, products;
