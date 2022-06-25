const { Schema, model } = require("mongoose");

const SellersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

SellersSchema.virtual("url").get(function () {
  return `/sellers/${this._id}`;
});

module.exports = model("Seller", SellersSchema);
