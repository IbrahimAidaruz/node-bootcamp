require("dotenv").config();
const jwt = require("jsonwebtoken");
const config = require("config");
const Account = require("../models/accounts-model");

const requirAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.get("jwt.secret"), (err, encodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, config.get("jwt.secret"), async (err, encodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await Account.findById(encodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requirAuth, checkUser };
