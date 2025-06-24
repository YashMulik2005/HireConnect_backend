const CompanyModel = require("../model/companyModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  sucessResponse,
  errorResponse,
  notFoundResponse,
  sucessfullyCreatedResponse,
} = require("../utils/responseUtils");
dotenv.config();

const signUp = async (req, res) => {
  try {
    const { name, mail, password, link, linkedin_link } = req.body;

    const existingCompany = await CompanyModel.findOne({ mail });

    if (existingCompany) {
      return errorResponse(
        res,
        new Error("Duplicate company signup attempt"),
        "Company with this email already exists"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = new CompanyModel({
      name,
      mail,
      password: hashedPassword,
      link,
      linkedin_link,
    });

    await company.save();
    return sucessfullyCreatedResponse(res, company);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    let company = await CompanyModel.findOne({ mail });

    if (!company) {
      return notFoundResponse(res, "User not found.");
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials.");
    }

    const payload = {
      id: company._id,
      mail: company.mail,
      name: company.name,
      address: company.address,
      type: "company",
    };

    company.type = "company";

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

const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    const company = await CompanyModel.findById(req.user.id);

    company.address = address;
    await company.save();

    return sucessResponse(res, company, "address updated sucessfully.");
  } catch (err) {}
};

const updateProfile = async (req, res) => {
  try {
    const { name, mail, link, linkedin_link, address } = req.body;

    const company = await CompanyModel.findById(req.user.id);
    if (!company) {
      return notFoundResponse(res, "Company not found.");
    }

    company.name = name || company.name;
    company.mail = mail || company.mail;
    company.link = link || company.link;
    company.linkedin_link = linkedin_link || company.linkedin_link;
    company.address = address || company.address;

    await company.save();
    return sucessResponse(res, company, "Profile updated successfully.");
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const company = await CompanyModel.findById(req.user.id);
    if (!company) {
      return notFoundResponse(res, "Company not found.");
    }

    company.status = status;
    company.save();

    return sucessResponse(res, company, "status updated successfully.");
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updateLogo = async (req, res) => {
  try {
    const { logo_url } = req.body;
    const company = await CompanyModel.findById(req.user.id);
    if (!company) {
      return notFoundResponse(res, "Company not found.");
    }

    company.logo_url = logo_url;
    await company.save();
    return sucessResponse(res, company, "Profile updated successfully.");
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  login,
  signUp,
  updateAddress,
  updateProfile,
  updateStatus,
  updateLogo,
};
