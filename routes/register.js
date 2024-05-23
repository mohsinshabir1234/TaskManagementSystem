const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/register", (req, res) => {
  res.render("pages/signup");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/tasks",
    failureRedirect: "/login",
  })
);

module.exports = router;
