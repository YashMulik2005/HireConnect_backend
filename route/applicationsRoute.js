const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const {
  apply,
  getUserApplications,
  getApplicationsByJob,
  getSingleApplication,
  changeApplicationStatus,
  sendTestmail,
} = require("../controller/applicationsController");

router.post("/apply", verifyToken, apply);
router.get("/", verifyToken, getUserApplications);
router.post("/mail", sendTestmail);

router.get("/byJob/:job_id", verifyToken, getApplicationsByJob);
router.get("/:application_id", verifyToken, getSingleApplication);
router.post(
  "/statusUpdate/:application_id",
  verifyToken,
  changeApplicationStatus
);

module.exports = router;
