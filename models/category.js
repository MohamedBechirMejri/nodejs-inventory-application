const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

CategorySchema.virtual("url").get(function () {
  return `/categories/${this._id}`;
});

module.exports = model("Categorie", CategorySchema);
