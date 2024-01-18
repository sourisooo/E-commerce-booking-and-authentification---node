require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

const pgSession = require('connect-pg-simple')(session);


// Local imports
const router = require('./app/routers');
const errorHandlers = require('./middlewares/errorHandlers');
const loadUserToLocals = require('./middlewares/loadUserToLocals');

// Body parser
app.use(express.urlencoded({ extended: true }));

const { Client } = require("pg");

const {DataTypes} = require('sequelize');
const sequelize = require('./app/database');
// const queryInterface = sequelize.getQueryInterface();

const pgClient = new Client('postgres://postgres:random@localhost/shoppingcart');

pgClient.connect();


// Charger les données de la sessions sur `req.session` et `res.locals`
app.use(
    session({
        saveUninitialized: true,
        resave: true,
        secret: 'Un secret pour signer les id de sessions',
     

    // store: new pgSession({ // BONUS : persister la session en BDD Postgres. Ignorer pour une première relecture
    //     pool : pgClient, // On prend notre connecteur sequelize et on cherche le client PG sous la capot // Soit on re-créer un !
    //     tableName : 'sessions',
    //     createTableIfMissing: true,

    //   }),
    
    })
);

// sequelize.query('ALTER TABLE "sessions" ADD COLUMN "user_id" INTEGER REFERENCES users("id");', { raw: true });

// sequelize.query('ALTER TABLE "sessions" RENAME COLUMN "sid" TO "id";', { raw: true })


app.use(loadUserToLocals);

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', './app/views');

// Statically served files
app.use(express.static(path.join(__dirname, './assets')));

// Nos Routes
app.use(router);

// middleware 404
app.use(errorHandlers.notFound);

// middleware formatage et affichage des erreurs
app.use(errorHandlers.developmentErrors);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
