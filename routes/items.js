const express = require("express");

const router = express.Router();

const itemController = require("../controllers/item");

router.get("/", itemController.index);

router.get("/:id", itemController.getItem);

router.get("/create", itemController.getCreateItem);

router.post("/create", itemController.postCreateItem);

router.get("/:id/edit", itemController.getEditItem);

router.post("/:id/edit", itemController.postEditItem);

router.get("/:id/delete", itemController.getDeleteItem);

router.post("/:id/delete", itemController.postDeleteItem);

module.exports = router;
