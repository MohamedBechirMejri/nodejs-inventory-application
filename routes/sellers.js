const express = require("express");

const router = express.Router();

const sellerController = require("../controllers/seller");

router.get("/", sellerController.index);

router.get("/:id", sellerController.getSeller);

router.get("/create", sellerController.getCreateSeller);

router.post("/create", sellerController.postCreateSeller);

router.get("/:id/edit", sellerController.getEditSeller);

router.post("/:id/edit", sellerController.postEditSeller);

router.get("/:id/delete", sellerController.getDeleteSeller);

router.post("/:id/delete", sellerController.postDeleteSeller);

module.exports = router;
