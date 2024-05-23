const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// Define isAuthenticated function
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

// Route definitions
router.get("/", isAuthenticated, async (req, res) => {
  const { status } = req.query;

  try {
    let tasks;
    if (status && status !== "") {
      tasks = await Task.find({ status });
    } else {
      tasks = await Task.find();
    }
    res.render("pages/index", { tasks });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      res.send("Enter valid title");
    }
    const newTask = new Task({
      title,
      description,
      status,
    });

    await newTask.save();
    res.redirect("/");
    console.log("task created");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/:id/delete", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  console.log("I am here");
  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).send(error);
    }

    res.redirect("/");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/:id/edit", async (req, res) => {
  const { title, description, status } = req.body;
  try {
    await Task.findByIdAndUpdate(req.params.id, { title, description, status });
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
