const express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/create", (req, res, next) => {
  res.render("create", { title: "Create" });
});

module.exports = router;
