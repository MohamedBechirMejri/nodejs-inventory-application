const express = require("express");

const router = express.Router();

const {
  index,
  read,
  createGet,
  createPost,
  updateGet,
  updatePost,
  deleteGet,
  deletePost,
} = require("../controllers/category");

router.get("/", index);

router.get("/create", createGet);

router.post("/create", createPost);

router.get("/:id", read);

router.get("/:id/edit", updateGet);

router.post("/:id/edit", updatePost);

router.get("/:id/delete", deleteGet);

router.post("/:id/delete", deletePost);

module.exports = router;
