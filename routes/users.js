const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const csurf = require("csurf");
const csrfProtection = csurf({ cookie: true });


router.get("/register", csrfProtection, (req, res) => {
  res.render("register", { csrfToken: req.csrfToken() });
});

router.get('/dashboard', csrfProtection, (req, res) => {
  res.render('dashboard', { csrfToken: req.csrfToken() });
});


router.post("/register", csrfProtection, userController.registerUser);


router.get("/login", csrfProtection, (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

router.post("/login", csrfProtection, userController.loginUser);




router.get("/logout", userController.logoutUser);


router.get("/forgot", csrfProtection, (req, res) => {
  res.render("forgot", { csrfToken: req.csrfToken() });
});

router.post("/forgot", csrfProtection, userController.forgotPassword);

router.post('/users/reset/:token', csrfProtection, userController.resetPassword);



router.get(
  "/reset/:token",
  csrfProtection,
  userController.displayResetPasswordForm
);

router.post("/reset/:token", csrfProtection, userController.resetPassword);

module.exports = router;
