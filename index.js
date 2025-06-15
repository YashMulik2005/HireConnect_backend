const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const StudentRoutes = require("./route/studentRoutes");

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
