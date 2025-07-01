const express = require("express");
const router = express.Router();

const {
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
  getStudentDetails,
  addSocialLinks,
  addContactDeatils,
  addResume,
  updateProfileImage,
} = require("../controller/studentController");

const { verifyToken } = require("../utils/AuthUtils");

router.post("/signUp", signup);
router.post("/login", login);
router.get("/", verifyToken, getStudentDetails);

router.post("/addskills", verifyToken, addSkills);

router.post("/addEducation", verifyToken, addEducation);
router.delete("/deleteEducation/:id", verifyToken, deleteEduction);
router.put("/updateEducation/:id", verifyToken, updateEducation);

router.post("/addProject", verifyToken, addProject);
router.put("/updateProject/:id", verifyToken, updateProject);
router.delete("/deleteProject/:id", verifyToken, deleteProject);

router.post("/addExperience", verifyToken, addExperience);
router.put("/updateExperience/:id", verifyToken, updateExperience);
router.delete("/deleteExperience/:id", verifyToken, deleteExperience);

router.post("/updateProfileImage", verifyToken, updateProfileImage);
router.post("/addContactDeatils", verifyToken, addContactDeatils);
router.post("/addSocialLinks", verifyToken, addSocialLinks);
router.post("/resume", verifyToken, addResume);

module.exports = router;
