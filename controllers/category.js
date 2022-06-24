/* eslint-disable consistent-return */
const debug = require("debug")("app:category");
const async = require("async");

const Category = require("../models/category");
const Item = require("../models/item");

exports.index = (req, res) => {
  Category.find()
    .then(categories => {
      res.render("categories/index", { categories });
    })
    .catch(err => {
      debug(err);
    });
};

exports.getCategory = (req, res, next) => {
  async.parallel(
    {
      category: callback => {
        Category.findById(req.params.id).exec(callback);
      },
      items: callback => {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category === null) {
        const error = new Error("Category not found");
        error.status = 404;
        return next(error);
      }

      res.render("categories/show", {
        category: results.category,
        items: results.items,
      });
    }
  );
};
