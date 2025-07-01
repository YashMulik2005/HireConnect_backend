const JobModel = require("../model/jobModel");
const studentModel = require("../model/studentModel");
const {
  sucessfullyCreatedResponse,
  errorResponse,
  sucessResponse,
  notFoundResponse,
} = require("../utils/responseUtils");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.gemini_api,
});

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
    const {
      job_type,
      categories,
      min_salary,
      max_salary,
      experience,
      job_modes,
    } = req.query;

    const filter = {};

    if (job_type) {
      filter.job_type = { $in: job_type.split(",") };
    }

    if (categories) {
      filter.category = { $in: categories.split(",") };
    }

    if (min_salary || max_salary) {
      filter.salary = {};
      if (min_salary) filter.salary.$gte = parseInt(min_salary);
      if (max_salary) filter.salary.$lte = parseInt(max_salary);
    }

    if (experience) {
      filter.required_experience = { $in: experience.split(",") };
    }

    if (job_modes) {
      filter.job_mode = { $in: job_modes.split(",") };
    }

    const jobs = await JobModel.find(filter)
      .select("title description salary required_skills job_mode reg_date")
      .populate("company", "name address");

    return sucessResponse(res, jobs);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getJobsById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await JobModel.findById(id).populate("company");
    return sucessResponse(res, jobs);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getJobAnalytics = async (req, res) => {
  try {
    const { job_id } = req.params;
    const job = await JobModel.findById(job_id).populate("company");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await studentModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const prompt = `
You are an AI assistant helping generate job analytics for a job application platform.

Given the following data:

User Profile:
- Name: ${user.name}
- Email: ${user.email}
- Skills: ${user.skills?.join(", ") || "Not available"}
- Experience: ${user.experience || "Not provided"}
- Resume Summary: ${user.resume_summary || "No summary"}

Job Details:
- Title: ${job.title}
- Mode: ${job.job_mode}
- Type: ${job.job_type}
- Required Experience: ${job.required_experience}
- Required Skills: ${job.required_skills?.join(", ")}
- Perks: ${job.perks?.join(", ")}
- Category: ${job.category}
- Description: ${job.description}
- Company Name: ${job.company?.name}
- Location: ${job.address?.building_name}, ${job.address?.area}, ${
      job.address?.city
    } - ${job.address?.pincode}
- Company Mail: ${job?.company?.mail}
- Company Site: ${job?.company?.link}

Now, generate the following 4 analytics in JSON format:

1. "skill_match_breakdown": {
    "matched_skills": [...],
    "missing_skills": [...]
}

2. "job_summary": "... short job summary in 30-35 words"

3. "company_snapshot": {
    "name": "...",
    "email": "...",
    "website": "...",
    "location": "..."
}

4. "application_readiness": {
    "score": "...%",
    "reason": "Short explanation of the score in 20 words"
}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // const textResponse = result.response.text();
    const cleaned = result.text.replace(/```json|```/g, "").trim();
    const analytics = JSON.parse(cleaned);
    return res.status(200).json({
      success: true,
      message: "Analytics generated successfully",
      data: analytics,
    });
  } catch (error) {
    console.error("Job Analytics Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

module.exports = {
  createJob,
  updateJob,
  getJobs,
  getJobsById,
  getJobAnalytics,
};
