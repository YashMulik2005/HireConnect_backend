const ApplicationsModel = require("../model/applicationsModel");
const JobModel = require("../model/jobModel");
const {
  sucessfullyCreatedResponse,
  errorResponse,
  notFoundResponse,
} = require("../utils/responseUtils");

const apply = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      job_id,
      resume,
      cover_letter,
      skills,
      education,
      projects,
      github_url,
      linkedin_url,
      experience,
    } = req.body;

    const job = await JobModel.findById(job_id);
    if (!job) {
      return notFoundResponse(res, "Job not found.");
    }

    const today = new Date();
    if (today > job.reg_date) {
      return errorResponse(res, "Application deadline has passed.");
    }

    const existingApplication = await ApplicationsModel.findOne({
      student_id: studentId,
      job_id,
    });

    if (existingApplication) {
      return errorResponse(res, "You have already applied for this job.");
    }

    const newApplication = new ApplicationsModel({
      student_id: studentId,
      job_id,
      resume,
      cover_letter,
      status: "Under review",
      skills,
      education,
      projects,
      github_url,
      linkedin_url,
      experience,
    });

    await newApplication.save();

    return sucessfullyCreatedResponse(res, newApplication);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = { apply };
