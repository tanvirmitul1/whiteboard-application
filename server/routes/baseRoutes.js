const express = require("express");
const baseController = require("../controllers/baseControllers");

const router = express.Router();

router.get("/", baseController);

module.exports = router;
