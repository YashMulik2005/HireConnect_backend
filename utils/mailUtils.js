const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendmail = (receivermail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mail,
      pass: process.env.mail_password,
    },
  });
  let text = "Hello this is mail form nodemailer.";

  const mailOptions = {
    from: process.env.mail,
    to: receivermail,
    subject: "text",
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendmail;
