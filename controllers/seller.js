/* eslint-disable consistent-return */
const debug = require("debug")("app:seller");
const async = require("async");
const { body, validationResult } = require("express-validator");

const Seller = require("../models/seller");
const Item = require("../models/item");

exports.index = (req, res) => {
  Seller.find()
    .then(sellers => {
      res.render("sellers/index", { sellers });
    })
    .catch(err => {
      debug(err);
    });
};

exports.read = (req, res, next) => {
  async.parallel(
    {
      seller: callback => {
        Seller.findById(req.params.id).exec(callback);
      },
      items: callback => {
        Item.find({ seller: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.seller === null) {
        const error = new Error("Seller not found");
        error.status = 404;
        return next(error);
      }

      res.render("sellers/show", {
        seller: results.seller,
        items: results.items,
      });
    }
  );
};

exports.createGet = (req, res) => {
  res.render("sellers/create");
};

exports.createPost = [
  body("name", "Name must not be empty").isLength({ min: 1 }).escape(),
  body("email").isEmail().normalizeEmail().withMessage("Email must be valid"),
  body("phone").isMobilePhone().withMessage("Phone must be valid"),
  body("image")
    .not()
    .isEmpty()
    .withMessage("Image link no provided")
    .isURL()
    .withMessage("Image link must be valid"),
  (req, res, next) => {
    const errors = validationResult(req);

    const seller = new Seller({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.body.image,
    });

    if (!errors.isEmpty())
      return res.render("sellers/create", {
        errors: errors.array(),
        seller,
      });

    Seller.findOne({ email: req.body.email }).then(foundSeller => {
      if (foundSeller) {
        return res.redirect(foundSeller.url);
      }
      seller.save(err => {
        if (err) return next(err);
        res.redirect(seller.url);
      });
    });
  },
];

exports.updateGet = (req, res, next) => {
  Seller.findById(req.params.id)
    .then(seller => {
      if (seller === null) {
        const error = new Error("Seller not found");
        error.status = 404;
        return next(error);
      }
      res.render("sellers/edit", { seller });
    })
    .catch(err => {
      debug(err);
    });
};
