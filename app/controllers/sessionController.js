const bcrypt = require('bcrypt');
const { User, Role, UserSession, Session, Product } = require('../models');
let  {products}  = require('./catalogController');
const catalogController = require('./catalogController');



const sessionController = {
    index: (req, res) => {
        res.render('login');
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // !! Votre code à partir d'ici

            // On récupère user avec le role
            // Est-ce que l'utilisateur existe en BDD ?
            // Sélectionner user avec email et inclure le role, si on ne le trouve pas :
            //      on envoie un message d'erreur dans un objet:  {error: "Utilisateur ou mot de passe incorrect"} et on render `login` en lui passant l'erreur
            // Sinon on continue.

            // Le mot de passe est il correct ?
            // On compare le mots de passe du formulaire avec celui de l'utilisateur
            //      Si le mot de passe est incorrect : on envoie un message d'erreur dans un objet:  {error: "Utilisateur ou mot de passe incorrect"} et on render `login` en lui passant l'erreur

            // On ajoute user a la session

            // On enlève le mot de passe de la session.

            // !! Ne pas modifier cette ligne

            const user = await User.findOne({

                where: {
                    email: email,
                  },

                  include: [{

                    association: 'role',
    
    
                }]

            });

            if (!user) { 
                res.render('login', {error: 'Utilisateur ou mot de passe incorrect',});
              return;}


              const passwordMatch = await bcrypt.compare(password, user.password);


              if (!passwordMatch) {
                res.render('login', {error: 'Utilisateur ou mot de passe incorrect',});
                return;
              }

              req.session.user = user;
              req.session.user.password = '';

             const session =  await Session.findOne({where:{user_id: req.session.user.id}});

             if((session != undefined)) {

                console.log(session != undefined, session.panier != null, req.session.user);

             const panierArray = Object.assign([], session.panier.replaceAll('id', '').replaceAll(',', '').replaceAll(' ', '').replaceAll(', ', '').replaceAll(' ,', '').replaceAll(':', '').replaceAll('{', '').replaceAll('}', '').replaceAll('"', '').replaceAll('null', ''));

            //  console.log(panierArray);

            //  console.log(req.session.cart);

            if((req.session.cart)&&(session != undefined)){

            products = req.session.cart;
            // console.log(products);


            const sessionupdate = await Session.findOne({where:{user_id: req.session.user.id}});

                // console.log(sessionupdate);

                for (prod of products) {

          sessionupdate.panier=`${sessionupdate.panier}, {"id":${prod.id}}`;
            //  console.log(sessionupdate.panier);
            //  console.log(prod.id);
        
        }
  
        //   console.log(prod.toString(), sessionupdate.panier);

        sessionupdate.changed('panier', true);
  
          sessionupdate.save();

          for (prod of panierArray) {


            const prequest = await Product.findByPk(parseInt(prod));

            products.push(prequest.dataValues);

            req.session.cart = products;

            // console.log(req.session.cart );

         }

        
                } else if((!req.session.cart)&&(session != undefined)){


                    for (prod of panierArray) {


                        const prequest = await Product.findByPk(parseInt(prod));
            
                        products.push(prequest.dataValues);
            
                        req.session.cart = products;
            
                        // console.log(req.session.cart );
            
                     }

                }};

 
            //  console.log(req.session.cart);


            res.redirect('/cart');

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
    },

    logout: (req, res) => {
        // !! Votre code ici

        req.session.destroy();

        // console.log(req.session);

        products = [];
        
        res.redirect('/');
    },
};

module.exports = sessionController;
