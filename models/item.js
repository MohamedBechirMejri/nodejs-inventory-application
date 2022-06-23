const { Schema, model } = require("mongoose");

const ItemsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 15,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Categorie",
        required: true,
      },
    ],
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Sellers",
      required: true,
    },
  },
  { timestamps: true }
);

ItemsSchema.virtual("url").get(function () {
  return `/items/${this._id}`;
});

module.exports = model("Items", ItemsSchema);
