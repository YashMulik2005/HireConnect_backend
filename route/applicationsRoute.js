const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const {
  apply,
  getUserApplications,
} = require("../controller/applicationsController");

router.post("/apply", verifyToken, apply);
router.get("/", verifyToken, getUserApplications);

module.exports = router;
