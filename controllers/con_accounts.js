require("dotenv").config();
const Account = require("../models/accounts-model");
const jwt = require("jsonwebtoken");
const config = require("config");
const passport = require("passport");

//error handler function

function errorHandlers(err) {
  console.log(err.message, err.code);
  const errors = { username: "", email: "", password: "" };

  //email errors

  if (err.message == "incorrect Email") {
    errors.email = "Email-kan  ma diiwaan gashana";
  }

  //password errors
  if (err.message == "incorrect Password") {
    errors.password = "password-ku iyo emailku isma lahan , password khaldan";
  }
  if (err.code === 11000) {
    //duplicated email errors
    errors.email = "Fadlan emailkaan waa la qaatay, mid kale dooro";
    return errors;
  }

  if (err.message.includes("account validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

//token creater function
const maxAge = 3 * 24 * 60 * 60;
const secret = config.get("jwt.secret");

const createToken = id => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

//router controllers

const signup_get = (req, res) => {
  res.render("accounts/signup");
};

const signup_post = (req, res) => {
  const { email, username, password } = req.body;

  const user = Account.create({
    email,
    username,
    password,
  })
    .then(u => {
      const token = createToken(u._id);
      res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });
      res.status(201).send({ user: u._id });
    })
    .catch(err => {
      const errors = errorHandlers(err);
      res.status(400).json({ errors });
    });
};

const login_get = (req, res) => {
  res.render("accounts/login");
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.login(email, password);
    const token = createToken(account._id);
    res.cookie("jwt", token, { maxAge: maxAge, httpOnly: true });
    res.status(200).json({ user: account._id });
  } catch (err) {
    const errors = errorHandlers(err);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

//google callback redirect

const google_redirect = (req, res) => {
  console.log(req.user);
  res.redirect("/contact");
};

module.exports = {
  login_get,
  login_post,
  signup_post,
  signup_get,
  logout_get,
  google_redirect,
};
