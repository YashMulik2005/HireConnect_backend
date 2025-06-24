const mongoose = require("mongoose");

const companyScheam = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  linkedin_link: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  address: {
    type: Object,
  },
  logo_url: {
    type: String,
  },
});

const CompanyModel = mongoose.model("Company", companyScheam);

module.exports = CompanyModel;
