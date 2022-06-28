/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const debug = require("debug")("app:item");
const async = require("async");
const { body, validationResult } = require("express-validator");

const Item = require("../models/item");
const Seller = require("../models/seller");
const Category = require("../models/category");

exports.index = (req, res, next) => {
  Item.find()
    .populate("seller category")
    .exec((err, items) => {
      if (err) return next(err);
      res.render("items/index", {
        items,
        title: "Items",
      });
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
        title: results.item.name,
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
        title: "Create Item",
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
      stock: req.body.stock,
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
            title: "Create Item",
          });
        }
      );
      return;
    }

    item.save(err => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
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
        if (category._id.toString() === results.item.category.toString()) {
          category.selected = true;
        }
      });

      res.render("items/update", {
        item: results.item,
        categories: results.categories,
        sellers: results.sellers,
        title: "Edit Item",
      });
    }
  );
};

exports.updatePost = [
  body("name", "Name must be at least 3 characters long")
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be a number").isNumeric().escape(),
  body("description", "Description must be at least 15 characters long")
    .isLength({ min: 15 })
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

    if (!errors.isEmpty())
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
          if (err) return next(err);
          res.render("items/update", {
            categories: results.categories,
            sellers: results.sellers,
            item: req.body,
            errors: errors.array(),
            title: "Edit Item",
          });
        }
      );

    Item.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          image: req.body.image,
          stock: req.body.stock,
          seller: req.body.seller,
          category: req.body.category,
        },
      },
      (err, item) => {
        if (err) return next(err);

        if (item === null) {
          const error = new Error("Item not found");
          error.status = 404;
          return next(error);
        }

        res.redirect(item.url);
      }
    );
  },
];

exports.deleteGet = (req, res, next) => {
  Item.findById(req.params.id, (err, item) => {
    if (err) return next(err);
    if (item === null) {
      const error = new Error("Item not found");
      error.status = 404;
      return next(error);
    }
    res.render("items/delete", {
      item,
      title: "Delete Item",
    });
  });
};

exports.deletePost = [
  body("adminpass")
    .equals(process.env.ADMIN_PASS)
    .withMessage("Wrong Admin Password")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      Item.findById(req.params.id, (err, item) => {
        if (err) {
          return next(err);
        }
        if (item === null) {
          const error = new Error("Item not found");
          error.status = 404;
          return next(error);
        }
        res.render("items/delete", {
          item,
          errors: errors.array(),
          adminpass: req.body.adminpass,
          title: "Delete Item",
        });
      });
    else
      Item.findByIdAndRemove(req.params.id, err => {
        if (err) {
          return next(err);
        }
        res.redirect("/items");
      });
  },
];
