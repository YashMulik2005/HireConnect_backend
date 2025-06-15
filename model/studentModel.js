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

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  resume: {
    type: String,
  },
  address: {
    type: Object,
    required: true,
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
  is_completed: {
    type: Boolean,
    default: false,
  },
});

const StudentModel = mongoose.model("Student", studentSchema);

module.exports = StudentModel;
