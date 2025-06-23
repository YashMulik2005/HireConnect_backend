const studentModel = require("../model/studentModel");
const {
  sucessResponse,
  errorResponse,
  notFoundResponse,
  sucessfullyCreatedResponse,
} = require("../utils/responseUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signup = async (req, res) => {
  try {
    const { name, mail, password, address } = req.body;

    const existingStudent = await studentModel.findOne({ mail });

    if (existingStudent) {
      return errorResponse(res, "Student with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new studentModel({
      name,
      mail,
      password: hashedPassword,
      address,
    });

    await student.save();

    return sucessfullyCreatedResponse(res, student);
  } catch (error) {
    return errorResponse(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    let student = await studentModel.findOne({ mail });

    if (!student) {
      return notFoundResponse(res, "User not found.");
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials.");
    }

    const payload = {
      id: student._id,
      mail: student.mail,
      name: student.name,
      address: student.address,
      type: "student",
    };

    student.type = "student";

    const token = await jwt.sign(payload, process.env.jwt_secret);

    // return sucessResponse(res, "login sucessfull.", token);
    return res.status(200).json({
      status: true,
      message: "Login sucessfull",
      data: payload,
      token: token,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const addSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const student = await studentModel.findOne({ _id: req.user.id });
    if (!student) {
      return notFoundResponse(res, "student not found.");
    }

    student.skills = skills;
    await student.save();

    return sucessResponse(res, student, "skills added sucessfully");
  } catch (err) {
    return errorResponse(res, err);
  }
};

const addEducation = async (req, res) => {
  try {
    const { education } = req.body;
    console.log("jdbehd", education);

    if (!education) {
      return notFoundResponse(res, "education filed is not provided.");
    }

    const student = await studentModel.findById(req.user.id);
    if (!student) {
      return notFoundResponse(res, "student not found.");
    }

    student.education.push(education);
    await student.save();

    return sucessResponse(res, student);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const deleteEduction = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentModel.findById(req.user.id);
    if (!student) {
      return notFoundResponse(res, "student not found.");
    }

    const initialLength = student.education.length;
    student.education = student.education.filter(
      (item) => item._id.toString() !== id
    );

    if (student.education.length === initialLength) {
      return notFoundResponse(res, "Education entry not found.");
    }

    await student.save();
    return sucessResponse(res, student);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { education } = req.body;

    if (!education || typeof education !== "object") {
      return errorResponse(res, "Education data is missing or invalid.");
    }

    const student = await studentModel.findById(req.user.id);
    if (!student) {
      return notFoundResponse(res, "Student not found.");
    }

    const index = student.education.findIndex(
      (item) => item._id.toString() === id
    );

    if (index === -1) {
      return notFoundResponse(res, "Education entry not found.");
    }

    student.education[index] = {
      ...student.education[index]._doc,
      ...education,
    };

    await student.save();

    return sucessResponse(
      res,
      student,
      "Education entry updated successfully."
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

const addProject = async (req, res) => {
  try {
    const { project } = req.body;

    if (!project) return errorResponse(res, "Project data is required.");

    const student = await studentModel.findById(req.user.id);
    if (!student) return notFoundResponse(res, "Student not found.");

    student.projects.push(project);
    await student.save();

    return sucessResponse(res, student.projects, "Project added successfully.");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { project } = req.body;

    if (!project) return errorResponse(res, "Project data is required.");

    const student = await studentModel.findById(req.user.id);
    if (!student) return notFoundResponse(res, "Student not found.");

    const index = student.projects.findIndex((p) => p._id.toString() === id);
    if (index === -1) return notFoundResponse(res, "Project not found.");

    student.projects[index] = {
      ...student.projects[index]._doc,
      ...project,
    };

    await student.save();

    return sucessResponse(
      res,
      student.projects,
      "Project updated successfully."
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await studentModel.findById(req.user.id);
    if (!student) return notFoundResponse(res, "Student not found.");

    const initialLength = student.projects.length;

    student.projects = student.projects.filter((p) => p._id.toString() !== id);

    if (student.projects.length === initialLength)
      return notFoundResponse(res, "Project not found.");

    await student.save();

    return sucessResponse(
      res,
      student.projects,
      "Project deleted successfully."
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const addExperience = async (req, res) => {
  try {
    const { experience } = req.body;

    if (!experience) return errorResponse(res, "Experience data is required.");

    const student = await studentModel.findById(req.user.id);
    if (!student) return notFoundResponse(res, "Student not found.");

    student.experience.push(experience);
    await student.save();

    return sucessResponse(
      res,
      student.experience,
      "Experience added successfully."
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience } = req.body;

    if (!experience) return errorResponse(res, "Experience data is required.");

    const student = await studentModel.findById(req.user.id);
    if (!student) return notFoundResponse(res, "Student not found.");

    const index = student.experience.findIndex((e) => e._id.toString() === id);
    if (index === -1) return notFoundResponse(res, "Experience not found.");

    student.experience[index] = {
      ...student.experience[index]._doc,
      ...experience,
    };

    await student.save();

    return sucessResponse(
      res,
      student.experience,
      "Experience updated successfully."
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await studentModel.findById(req.user.id);
    if (!student) return notFoundResponse(res, "Student not found.");

    const initialLength = student.experience.length;

    student.experience = student.experience.filter(
      (e) => e._id.toString() !== id
    );

    if (student.experience.length === initialLength)
      return notFoundResponse(res, "Experience not found.");

    await student.save();

    return sucessResponse(
      res,
      student.experience,
      "Experience deleted successfully."
    );
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = {
  signup,
  login,
  addSkills,
  addEducation,
  deleteEduction,
  updateEducation,
  addProject,
  updateProject,
  deleteProject,
  addExperience,
  updateExperience,
  deleteExperience,
};
