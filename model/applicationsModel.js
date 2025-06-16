const mongoose = require("mongoose");

const applicationsSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Under review",
      "shortlisted",
      "Interview Scheduled",
      "Selected",
      "Rejected",
    ],
    required: true,
    default: "Under Review",
  },
  resume: {
    type: String,
    required: true,
  },
  cover_letter: {
    type: String,
  },
});

const ApplicationsModel = mongoose.model("Applictions", applicationsSchema);

module.exports = ApplicationsModel;
