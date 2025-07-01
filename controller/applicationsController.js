const ApplicationsModel = require("../model/applicationsModel");
const JobModel = require("../model/jobModel");
const {
  sucessfullyCreatedResponse,
  errorResponse,
  notFoundResponse,
  sucessResponse,
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
      name,
      mail,
      mobile_no,
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
      skills,
      education,
      projects,
      github_url,
      linkedin_url,
      experience,
      name,
      mobile_no,
      mail,
    });

    await newApplication.save();

    return sucessfullyCreatedResponse(res, newApplication);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getUserApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { student_id: req.user.id };
    if (status) {
      query.status = status;
    }

    const applications = await ApplicationsModel.find(query)
      .select("job_id status createdAt")
      .populate({
        path: "job_id",
        select: "title job_mode company",
        populate: {
          path: "company",
          select: "name",
        },
      });

    return sucessResponse(
      res,
      applications,
      "Applications fetched successfully."
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = { apply, getUserApplications };
