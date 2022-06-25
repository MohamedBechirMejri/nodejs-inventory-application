const express = require("express");

const router = express.Router();

const {
  index,
  getCategory,
  getCreateCategory,
  postCreateCategory,
  getEditCategory,
  postEditCategory,
  getDeleteCategory,
  postDeleteCategory,
} = require("../controllers/category");

router.get("/", index);

router.get("/create", getCreateCategory);

router.post("/create", postCreateCategory);

router.get("/:id", getCategory);

router.get("/:id/edit", getEditCategory);

router.post("/:id/edit", postEditCategory);

router.get("/:id/delete", getDeleteCategory);

router.post("/:id/delete", postDeleteCategory);

module.exports = router;
