const express = require("express");
const router = require("./routes/accounts");
require("dotenv").config();
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requirAuth, checkUser } = require("./middleware/accMiddleware");
const passportSetup = require("./setup/google-oauth");
const cookieSession = require("cookie-session");
const passport = require("passport");

//app
const app = express();

//port

const PORT = process.env.PORT || 4500;

//set view engine
app.set("view engine", "ejs");

//database connection
const db_url = config.get("database.url");
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("database successfully connected...");
  })
  .catch(err => {
    console.log("could not connect to database", err);
  });

//built in middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 3 * 60 * 60 * 100,
    keys: config.get("jwt.secret"),
  })
);
//intialize passport

app.use(passport.initialize());
app.use(passport.session());

//api routers
app.get("*", checkUser);
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", requirAuth, (req, res) => {
  res.render("about");
});

app.get("/contact", requirAuth, (req, res) => {
  res.render("contact");
});
app.use("/", router);
app.use("/commingpages", requirAuth, (req, res) => {
  res.render("comingpages");
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`app is listen to the port ${PORT}`);
});
