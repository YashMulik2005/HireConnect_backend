const ApplicationsModel = require("../model/applicationsModel");
const JobModel = require("../model/jobModel");
const {
  sucessfullyCreatedResponse,
  errorResponse,
  notFoundResponse,
  sucessResponse,
} = require("../utils/responseUtils");
const sendmail = require("../utils/mailUtils");

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

const getApplicationsByJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const applications = await ApplicationsModel.find({
      job_id: job_id,
    }).select("name resume status linkedin_url github_url mail");

    return sucessResponse(
      res,
      applications,
      "Applications fetched successfully."
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getSingleApplication = async (req, res) => {
  try {
    const { application_id } = req.params;
    const applications = await ApplicationsModel.findById(application_id);

    return sucessResponse(
      res,
      applications,
      "Application fetched successfully."
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

const changeApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { application_id } = req.params;

    const application = await ApplicationsModel.findById(application_id);

    if (!application) return notFoundResponse(res, "Application not found.");

    application.status = status;
    await application.save();

    return sucessResponse(
      res,
      application.status,
      "Status updated successfully"
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

const sendTestmail = async (req, res) => {
  try {
    const { receivermail } = req.body;
    console.log("uvefve", receivermail);

    sendmail(receivermail);

    return sucessResponse(res, receivermail, "mail send successfully.");
  } catch (err) {
    console.log(err);
    return errorResponse(res, err);
  }
};

module.exports = {
  apply,
  getUserApplications,
  getApplicationsByJob,
  getSingleApplication,
  changeApplicationStatus,
  sendTestmail,
};
