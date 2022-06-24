const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/category");

router.get("/", categoryController.getcategory);

router.get("/:id", categoryController.getCategory);

router.get("/create", categoryController.getCreateCategory);

router.post("/create", categoryController.postCreateCategory);

router.get("/:id/edit", categoryController.getEditCategory);

router.post("/:id/edit", categoryController.postEditCategory);

router.get("/:id/delete", categoryController.getDeleteCategory);

router.post("/:id/delete", categoryController.postDeleteCategory);

module.exports = router;
