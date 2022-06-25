const express = require("express");

const router = express.Router();

const {
  index,
  getSeller,
  getCreateSeller,
  postCreateSeller,
  getEditSeller,
  postEditSeller,
  getDeleteSeller,
  postDeleteSeller,
} = require("../controllers/seller");

router.get("/", index);

router.get("/create", getCreateSeller);

router.post("/create", postCreateSeller);

router.get("/:id", getSeller);

router.get("/:id/edit", getEditSeller);

router.post("/:id/edit", postEditSeller);

router.get("/:id/delete", getDeleteSeller);

router.post("/:id/delete", postDeleteSeller);

module.exports = router;
