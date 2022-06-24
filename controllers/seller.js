const debug = require("debug")("app:seller");
const Seller = require("../models/seller");

exports.index = (req, res) => {
  Seller.find()
    .then(sellers => {
      res.render("sellers/index", { sellers });
    })
    .catch(err => {
      debug(err);
    });
};
