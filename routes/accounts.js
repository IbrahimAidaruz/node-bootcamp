const router = require("express").Router();
const passport = require("passport");

const {
  login_get,
  login_post,
  signup_post,
  signup_get,
  logout_get,
  google_redirect,
} = require("../controllers/con_accounts");

//login routes
router.get("/login", login_get);
router.post("/login", login_post);

//signup routes

router.get("/signup", signup_get);
router.post("/signup", signup_post);

//google routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//logout rooutes
router.get("/logout", logout_get);

//callback redirect route

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  google_redirect
);

module.exports = router;
