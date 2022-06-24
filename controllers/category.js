const debug = require("debug")("app:category");
const Category = require("../models/category");

exports.index = (req, res) => {
  Category.find()
    .then(categories => {
      res.render("categories/index", { categories });
    })
    .catch(err => {
      debug(err);
    });
};
