const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
  grade: { type: String },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  githubLink: { type: String },
  liveLink: { type: String },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
});

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
      "Under Review",
      "Shortlisted",
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
  skills: {
    type: [String],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
  projects: {
    type: [projectSchema],
    default: [],
  },
  github_url: {
    type: String,
  },
  linkedin_url: {
    type: String,
  },
  experience: {
    type: [experienceSchema],
    default: [],
  },
});

const ApplicationsModel = mongoose.model("Applictions", applicationsSchema);

module.exports = ApplicationsModel;
