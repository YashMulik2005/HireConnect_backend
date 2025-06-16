const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  required_skills: {
    type: [],
    required: true,
  },
  required_experience: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    enum: ["remote", "hybrid", "offline"],
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  reg_date: {
    type: Date,
    required: true,
  },
});

const JobModel = mongoose.model("Job", jobSchema);
module.exports = JobModel;
