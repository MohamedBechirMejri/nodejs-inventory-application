/* eslint-disable consistent-return */
const debug = require("debug")("app:category");
const async = require("async");
const { body, validationResult } = require("express-validator");

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

exports.getCreateCategory = (req, res) => {
  res.render("categories/create");
};

exports.postCreateCategory = [
  (req, res, next) => {
    body("name", "Name must not be empty").isLength({ min: 1 }).escape();
  },
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("categories/create", {
        errors: errors.array(),
        name: req.body.name,
      });
    } else {
      Category.findOne({ name: req.body.name }).exec((err, foundCategory) => {
        if (err) {
          return next(err);
        }
        if (foundCategory) {
          res.redirect(foundCategory.url);
        } else {
          category.save(errr => {
            if (errr) {
              return next(errr);
            }
            res.redirect(category.url);
          });
        }
      });
    }
  },
];
exports.getEditCategory = (req, res, next) => {
  Category.findOne({ _id: req.params.id }).exec((err, category) => {
    if (err) {
      return next(err);
    }
    if (category === null) {
      const error = new Error("Category not found");
      error.status = 404;
      return next(error);
    }
    res.render("categories/edit", { category });
  });
};

exports.postEditCategory = [
  (req, res, next) => {
    body("name", "Name must not be empty").isLength({ min: 1 }).escape();
  },
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("categories/edit", {
        errors: errors.array(),
        name: req.body.name,
      });
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        { $set: { name: req.body.name } },
        { new: true },
        (err, category) => {
          if (err) {
            return next(err);
          }
          res.redirect(category.url);
        }
      );
    }
  },
];
