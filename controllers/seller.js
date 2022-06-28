/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const debug = require("debug")("app:seller");
const async = require("async");
const { body, validationResult } = require("express-validator");

const Seller = require("../models/seller");
const Item = require("../models/item");

exports.index = (req, res) => {
  Seller.find()
    .then(sellers => {
      res.render("sellers/index", { sellers, title: "Sellers" });
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
        title: results.seller.name,
      });
    }
  );
};

exports.createGet = (req, res) => {
  res.render("sellers/create", { title: "Create Seller" });
};

exports.createPost = [
  body("name", "Name must not be empty").isLength({ min: 1 }).escape(),
  body("email").isEmail().normalizeEmail().withMessage("Email must be valid"),
  body("phone").isMobilePhone().withMessage("Phone must be valid"),
  body("image")
    .not()
    .isEmpty()
    .withMessage("Image link no provided")
    .contains("http")
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
        title: "Create Seller",
      });

    async.parallel(
      {
        sellerbyEmail: callback => {
          Seller.findOne({ email: req.body.email }).exec(callback);
        },
        sellerbyPhone: callback => {
          Seller.findOne({ phone: req.body.phone }).exec(callback);
        },
      },
      (err, results) => {
        if (err) return next(err);

        if (results.sellerbyEmail)
          return res.redirect(results.sellerbyEmail.url);

        if (results.sellerbyPhone)
          return res.redirect(results.sellerbyPhone.url);

        seller.save(err => {
          if (err) return next(err);
          res.redirect(seller.url);
        });
      }
    );
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
      res.render("sellers/edit", { seller, title: "Edit Seller" });
    })
    .catch(err => {
      debug(err);
    });
};

exports.updatePost = [
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

    if (!errors.isEmpty()) {
      return res.render("sellers/edit", {
        errors: errors.array(),
        seller: req.body,
        title: "Edit Seller",
      });
    }

    Seller.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          image: req.body.image,
        },
      },
      (err, seller) => {
        if (err) return next(err);
        if (seller === null) {
          const error = new Error("Seller not found");
          error.status = 404;
          return next(error);
        }
        res.redirect(seller.url);
      }
    );
  },
];

exports.deleteGet = (req, res, next) => {
  Seller.findById(req.params.id)
    .then(seller => {
      if (seller === null) {
        const error = new Error("Seller not found");
        error.status = 404;
        return next(error);
      }
      res.render("sellers/delete", { seller, title: "Delete Seller" });
    })
    .catch(err => {
      debug(err);
    });
};

exports.deletePost = [
  body("adminpass")
    .equals(process.env.ADMIN_PASS)
    .withMessage("Wrong Admin Password")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Seller.findById(req.params.id).exec((err, seller) => {
        if (err) {
          return next(err);
        }
        if (seller === null) {
          const error = new Error("Seller not found");
          error.status = 404;
          return next(error);
        }
        res.render("sellers/delete", {
          errors: errors.array(),
          seller,
          title: "Delete Seller",
        });
      });
    } else
      Seller.findByIdAndRemove(req.params.id)
        .then(seller => {
          if (seller === null) {
            const error = new Error("Seller not found");
            error.status = 404;
            return next(error);
          }
          res.redirect("/sellers");
        })
        .catch(err => {
          debug(err);
        });
  },
];
