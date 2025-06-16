const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthUtils");
const {
  createJob,
  updateJob,
  getJobs,
  getJobsById,
} = require("../controller/jobController");

router.post("/createJob", verifyToken, createJob);
router.put("/updateJob/:id", verifyToken, updateJob);
router.get("/", getJobs);
router.get("/:id", getJobsById);

module.exports = router;
