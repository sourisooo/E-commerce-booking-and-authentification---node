// On se sert des locals pour pouvoir utiliser la variable user dans les views.
const loadUserToLocals = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }

  if (req.session.cart) {
    res.locals.cart = req.session.cart;
  } else {
    res.locals.cart = null;
  }


  next();
};

module.exports = loadUserToLocals;
