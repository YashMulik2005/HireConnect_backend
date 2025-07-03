const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const {
  createJob,
  updateJob,
  getJobs,
  getJobsById,
  getJobAnalytics,
  getJobsByCompany,
  getOneJobForCompany,
} = require("../controller/jobController");

router.post("/createJob", verifyToken, createJob);
router.get("/jobsOfCompany", verifyToken, getJobsByCompany);
router.get("/", getJobs);
router.get("/getOneJobForCompany/:job_id", verifyToken, getOneJobForCompany);
router.get("/analytic/:job_id", verifyToken, getJobAnalytics);
router.get("/:id", getJobsById);
router.put("/updateJob/:id", verifyToken, updateJob);

module.exports = router;
