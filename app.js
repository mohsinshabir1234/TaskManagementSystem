const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("../TaskManagementSystem/passport-auth");
const session = require("express-session");

const app = express();
const authRoutes = require("./routes/register");
const taskRoutes = require("./routes/tasks");

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "mohsin",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection setup
mongoose.connect("mongodb://localhost:27017/taskManagementDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes setup
app.use("/tasks", taskRoutes);
app.use("/", authRoutes);

// Custom middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

// Default route
app.get("/", (req, res) => {
  res.redirect("/tasks");
});

// Server listening
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

module.exports = app; // Export the Express app instance
