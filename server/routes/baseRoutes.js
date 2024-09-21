const express = require("express");
const baseController = require("../controllers/baseControllers");

const router = express.Router();

router.post("/", baseController);

module.exports = router;
