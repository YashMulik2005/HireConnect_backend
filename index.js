const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const StudentRoutes = require("./route/studentRoutes");
const CompanyRoutes = require("./route/companyRoutes");
const JobRoutes = require("./route/jobRouts");
const appliationsRoute = require("./route/applicationsRoute");

mongoose.set("strictQuery", false);
var db = process.env.db_url;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/student", StudentRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/job", JobRoutes);
app.use("/api/application", appliationsRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
