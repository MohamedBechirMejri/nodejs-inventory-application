const express = require("express");

const router = express.Router();

const {
  index,
  getItem,
  getCreateItem,
  postCreateItem,
  getEditItem,
  postEditItem,
  getDeleteItem,
  postDeleteItem,
} = require("../controllers/item");

router.get("/", index);

router.get("/:id", getItem);

router.get("/create", getCreateItem);

router.post("/create", postCreateItem);

router.get("/:id/edit", getEditItem);

router.post("/:id/edit", postEditItem);

router.get("/:id/delete", getDeleteItem);

router.post("/:id/delete", postDeleteItem);

module.exports = router;
