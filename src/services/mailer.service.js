const nodemailer = require("nodemailer");
const { mailerConfig } = require("../configs/mailer.config");

const transporter = nodemailer.createTransport({
  pool: true,
  host: mailerConfig.host,
  port: mailerConfig.port,
  secure: true,
  auth: {
    user: mailerConfig.user,
    pass: mailerConfig.password,
  },
});

exports.sendMail = async function (receiver, subject, body) {
  try {
    const result = await transporter.sendMail({
      from: mailerConfig.user,
      to: receiver,
      subject,
      text: body,
    });
    return result;
  } catch (err) {
    console.log("MAILER ERROR", err);
    throw err; // this should be handled in the auth.controller.js registerHandler() catch
  }
};
