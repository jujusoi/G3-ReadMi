const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require('../models/')

// User Registration Route
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.redirect("/login"); // Redirect to login page after successful registration
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// User Login Route
router.get("/login", (req, res) => {
  res.render("login"); // Render the login page
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      const validPassword = await user.checkPassword(req.body.password);
      if (validPassword) {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        req.session.isAuthenticated = true;
        res.redirect("/dashboard"); // Redirect to a protected route like a user dashboard
      } else {
        res
          .status(401)
          .render("login", { error: "Incorrect email or password" });
      }
    } else {
      res.status(401).render("login", { error: "Incorrect email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// User Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy(); // Destroy the session to log the user out
  res.redirect("/login"); // Redirect to login page after logout
});

module.exports = router;
