const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const {
  login,
  signUp,
  updateAddress,
  updateProfile,
  updateStatus,
  updateLogo,
} = require("../controller/companyController");

router.post("/login", login);
router.post("/signUp", signUp);
router.post("/updateAddress", verifyToken, updateAddress);
router.put("/updateProfile", verifyToken, updateProfile);
router.put("/updateStatus", verifyToken, updateStatus);
router.put("/updateLogo", verifyToken, updateLogo);

module.exports = router;
