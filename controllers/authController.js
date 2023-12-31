const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/");
const loggedIn = require('../config/middleware/alreadyLogged');

// Validate email function
function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};


// User Registration Route
router.get("/register", loggedIn, (req, res) => {
  if (req.session.user) {
    const userInfo = req.session.user;
    res.render("register", { title: "READMi Register", userInfo });
  } else {
    res.render("register", { title: "READMi Register" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.redirect("/login"); // Redirect to login page if success
  } catch (error) {
    console.error(error);
    const errors = [];

    if (
      !req.body.username ||
      req.body.username.length < 2 ||
      req.body.username.length > 16
    ) {
      errors.push({ message: "Username must be between 2 and 16 characters." });
    }
    if (!req.body.email || !validateEmail(req.body.email)) {
      errors.push({ message: "Invalid email address." });
    }
    if (!req.body.password || req.body.password.length < 8) {
      errors.push({ message: "Password must be at least 8 characters." });
    }

    res.render("register", {
      title: "READMi Register",
      errors,
    });
  }
});

// User Login Route
router.get("/login", (req, res) => {
  if (req.session.user) {
    const userInfo = req.session.user;
    res.render("login", { title: "READMi Login", userInfo }); // Render the login page
  } else {
    res.render("login", { title: "READMi Login" }); // Render the login page
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      const validPassword = user.checkPassword(req.body.password); // Use the checkPassword method
      if (validPassword) {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        req.session.isAuthenticated = true;
        if (req.session.isAuthenticated) {
          res.redirect("/home");
        }
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
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy(); // Destroy the session to log the user out
    res.redirect("/login");
  } catch (err) {
    res.status(500).json({ message : 'Could not log out'});
  }
});

module.exports = router;
