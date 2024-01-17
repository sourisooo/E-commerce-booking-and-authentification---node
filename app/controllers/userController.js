const bcrypt = require('bcrypt');
const validator = require('email-validator');
const { User, Role } = require('../models');

const userController = {
    index: (req, res) => {
        res.render('register');
    },

    register: async (req, res) => {
        try {
            // !! votre code à partir d'ici
            // verifier l'email avec le package npm email-validator

            // verifier si password correspond à password confirm

            // hash password

            // attribuer un rôle ici, le role customer.

            // sauvegarder user

            // !! ne pas modifier cette ligne

            const {
                firstname, lastname, email, password, passwordConfirm,
              } = req.body;
          
              // Je vérifie que aucun des champs n'est vide
              if (!firstname || !lastname || !email || !password || !passwordConfirm) {
                res.render('register', {
                  error: 'Tous les champs sont obligatoires',
                });
                return;
              }
          
              // Je vérifie que le mot de passe et la confirmation sont identiques
              if (password !== passwordConfirm) {
                res.render('register', {
                    error: 'Le mot de passe et la confirmation doivent être identiques',
                });
                return;
              }
          
              // Si mon email n'est pas valide
              if (!validator.validate(email)) {
                res.render('register', {
                    error: 'L\'email n\'est pas valide',
                });
                return;
              }
          
              // Si je suis arrivé ici, c'est que toutes mes données sont valides
              // Mon utilisateur peut avoir déjà un compte
              const userWithSameEmail = await User.findOne({
                where: {
                  email,
                },
              });
          
              if (userWithSameEmail) {
                res.render('register', {
                    error: 'Un utilisateur avec cet email existe déjà',
                });
                return;
              }
          
              // Si je suis arrivé ici, c'est que mon utilisateur n'a pas de compte
              // et que toutes mes données sont valides
              // Pour créer un compte utilisateur, JE DOIS HACHER LE MOT DE PASSE
              const passwordHashed = await bcrypt.hash(password, 10);
          
              // Je crée mon utilisateur
              await User.create({
                firstname,
                lastname,
                email,
                password: passwordHashed,
                role_id: 1,
              });


            res.render('login', {
                message: 'Vous pouvez maintenant vous connecter !',
            });
        } catch (error) {
            console.log(error);
            res.render('register', { error: error.message });
        }
    },

    show: async (req, res) => {
        res.render('dashboard/dashboard');
    },
};

module.exports = userController;
