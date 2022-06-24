const debug = require("debug")("app:item");
const Item = require("../models/item");

exports.index = (req, res) => {
  Item.find()
    .then(items => {
      res.render("items/index", { items });
    })
    .catch(err => {
      debug(err);
    });
};
