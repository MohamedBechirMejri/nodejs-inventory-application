/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const debug = require("debug")("app:item");
const async = require("async");
const { body, validationResult } = require("express-validator");

const Item = require("../models/item");
const Seller = require("../models/seller");
const Category = require("../models/category");

exports.index = (req, res) => {
  Item.find()
    .then(items => {
      res.render("items/index", { items });
    })
    .catch(err => {
      debug(err);
    });
};

exports.read = (req, res, next) => {
  async.parallel(
    {
      item: callback => {
        Item.findById(req.params.id).populate("seller category").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item === null) {
        const error = new Error("Item not found");
        error.status = 404;
        return next(error);
      }
      res.render("items/show", {
        item: results.item,
      });
    }
  );
};

exports.createGet = (req, res, next) => {
  async.parallel(
    {
      categories: callback => {
        Category.find().exec(callback);
      },
      sellers: callback => {
        Seller.find().exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("items/create", {
        categories: results.categories,
        sellers: results.sellers,
      });
    }
  );
};

exports.createPost = [
  body("name", "Name must not be empty").isLength({ min: 1 }).escape(),
  body("price", "Price must be a number").isNumeric().escape(),
  body("description", "Description must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("image")
    .not()
    .isEmpty()
    .withMessage("Image link no provided")
    .isURL()
    .withMessage("Image link must be valid"),
  body("stock", "Stock must be a number").isNumeric().escape(),
  body("category", "Category must not be empty").not().isEmpty().escape(),
  body("seller", "Seller must not be empty").not().isEmpty().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      seller: req.body.seller,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: callback => {
            Category.find().exec(callback);
          },
          sellers: callback => {
            Seller.find().exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render("items/create", {
            categories: results.categories,
            sellers: results.sellers,
            item,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    item.save(err => {
      if (err) {
        return next(err);
      }
      res.redirect("/items");
    });
  },
];
exports.updateGet = (req, res, next) => {
  async.parallel(
    {
      item: callback => {
        Item.findById(req.params.id).populate("seller category").exec(callback);
      },
      categories: callback => {
        Category.find().exec(callback);
      },
      sellers: callback => {
        Seller.find().exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item === null) {
        const error = new Error("Item not found");
        error.status = 404;
        return next(error);
      }

      results.sellers.forEach(seller => {
        if (seller._id.toString() === results.item.seller.toString()) {
          seller.selected = true;
        }
      });

      results.categories.forEach(category => {
        results.item.category.forEach(itemCategory => {
          if (category._id.toString() === itemCategory.toString()) {
            category.checked = true;
          }
        });
      });

      res.render("items/update", {
        item: results.item,
        categories: results.categories,
        sellers: results.sellers,
      });
    }
  );
};
