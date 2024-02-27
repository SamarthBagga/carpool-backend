const { resolve } = require("path");
const { sign, verify } = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendMail } = require("../services/mailer.service");

console.log(
  "Mailing service for email verification is set to:",
  process.env.ENABLE_MAILER,
);

const COOKIE_MAX_AGE = 8640000000; // 100 days

const SERVER_URL =
  process.env.ENV === "DEV"
    ? `http://localhost:${process.env.SERVER_PORT}`
    : `https://carpool-backend-muj.onrender.com`;

const validDomains = ["muj.manipal.edu", "jaipur.manipal.edu"];

function validEmail(email) {
  if (!email.includes("@")) {
    return false;
  }
  const emailDomain = email.split("@")[1];
  return validDomains.includes(emailDomain);
}

module.exports = {
  async loginHandler(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email or Password fields are empty. Please fill both of them.",
      });
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "user does not exist",
      });
    }

    const isPasswordValid = await existingUser.validUser(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "user does not exist",
      });
    }

    if (!existingUser.verifiedEmail) {
      return res.status(401).json({
        success: false,
        message: "email has not been verified",
      });
    }

    const token = sign(
      { id: existingUser._id, email, password },
      process.env.SECRET_KEY,
    );
    res.cookie("secret-token", token, {
      maxAge: COOKIE_MAX_AGE,
      sameSite: "none",
      secure: true,
    });
    return res.json({ success: true, message: "successfully logged in" });
  },

  async registerUser(req, res) {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password || !validEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "user already exists",
        });
      }

      const userToken = sign(email, process.env.SECRET_KEY);

      const markup = `
        <p>
          Hi ${firstName} ${lastName},<br>
          Click on the below link to verify your account.<br>
          <a href="${SERVER_URL}/api/auth/verify-email-page?xc=${userToken}">Verify Your Account</a>
        </p>
      `;

      if (process.env.ENABLE_MAILER === "true") {
        const result = await sendMail(
          email,
          "Verify Email Carpool MUJ",
          markup,
        );
        console.log("mailer-result", result.response);
      }

      const newUser = new User({ firstName, lastName, email, password });

      if (process.env.ENABLE_MAILER === "false") {
        newUser.verifiedEmail = true;
      }

      const savedUser = await newUser.save();
      const { password: _, ...rest } = savedUser.toObject();

      return res.json({
        success: true,
        message: "successfully created the user",
        user: rest,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "something went wrong when creating the user",
      });
    }
  },
  async verifyEmailHandler(req, res) {
    const { token } = req.query;
    try {
      if (!token) {
        throw new Error("email not present in query params. " + token);
      }

      const decodedEmail = verify(token, process.env.SECRET_KEY);

      const user = await User.findOne({ email: decodedEmail });

      if (!user) {
        return res.status(400).json({
          success: false,
          message:
            "Account does not exist. Create an account with a valid Manipal University Jaipur email ID.",
        });
      }

      if (user.verifiedEmail) {
        return res.json({
          success: false,
          message: "Email is already verified no need to verify it again",
        });
      }

      user.verifiedEmail = true;
      await user.save();

      return res.json({
        success: true,
        message: "Email has been verified, you can close this tab",
      });
    } catch (err) {
      return res.status(403).json({
        success: true,
        message: "Could not verify the email",
      });
    }
  },
  async serveVerifyEmailPage(req, res) {
    res.sendFile(resolve(__dirname, "..", "..", "pages", "verify-email.html"));
  },
  async logoutHandler(req, res) {
    res.cookie("secret-token", "", { maxAge: 1, httpOnly: true });
    res.json({
      success: true,
      message: "logged out",
    });
  },
  async testController(req, res) {
    return res.json({
      success: true,
      message: "you are authorized",
      email: req.user?.email,
    });
  },
};
