const JobModel = require("../model/jobModel");
const {
  sucessfullyCreatedResponse,
  errorResponse,
  sucessResponse,
  notFoundResponse,
} = require("../utils/responseUtils");

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      required_skills,
      required_experience,
      job_type,
      address,
      reg_date,
      category,
      salary,
      job_mode,
      perks,
      numberOfOpenings,
      responsibilities,
    } = req.body;

    const companyId = req.user.id;

    const newJob = new JobModel({
      title,
      description,
      required_skills,
      required_experience,
      job_type,
      address,
      company: companyId,
      reg_date: reg_date,
      category,
      salary,
      job_mode,
      perks,
      numberOfOpenings,
      responsibilities,
    });

    await newJob.save();

    return sucessfullyCreatedResponse(res, newJob);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user.id;

    const job = await JobModel.findOne({ _id: jobId, company: companyId });
    if (!job) {
      return notFoundResponse(res, "Job not found or access denied.");
    }

    const {
      title,
      description,
      required_skills,
      required_experience,
      job_type,
      address,
      reg_date,
    } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.required_skills = required_skills || job.required_skills;
    job.required_experience = required_experience || job.required_experience;
    job.job_type = job_type || job.job_type;
    job.address = address || job.address;
    job.reg_date = reg_date || job.reg_date;

    await job.save();
    return sucessResponse(res, job, "Job updated successfully.");
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await JobModel.find({})
      .select("title description salary required_skills job_mode reg_date")
      .populate("company", "name address logo_url");

    return sucessResponse(res, jobs);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getJobsById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await JobModel.findById(id);
    return sucessResponse(res, jobs);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = { createJob, updateJob, getJobs, getJobsById };
