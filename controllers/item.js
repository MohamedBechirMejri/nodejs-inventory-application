/* eslint-disable consistent-return */
const debug = require("debug")("app:item");
const async = require("async");

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
