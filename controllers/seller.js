/* eslint-disable consistent-return */
const debug = require("debug")("app:seller");
const async = require("async");

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
