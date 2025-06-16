const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const { apply } = require("../controller/applicationsController");

router.post("/apply", verifyToken, apply);

module.exports = router;
