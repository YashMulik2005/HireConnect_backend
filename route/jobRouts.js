const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const {
  createJob,
  updateJob,
  getJobs,
  getJobsById,
  getJobAnalytics,
} = require("../controller/jobController");

router.post("/createJob", verifyToken, createJob);
router.put("/updateJob/:id", verifyToken, updateJob);
router.get("/", getJobs);
router.get("/:id", getJobsById);
router.get("/analytic/:job_id", verifyToken, getJobAnalytics);

module.exports = router;
