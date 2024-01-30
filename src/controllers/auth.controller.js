const { sign } = require("jsonwebtoken");
const User = require("../models/user.model");

/* code looks bad, abstract out some parts in a util */
module.exports = {
  async loginHandler(req, res) {
    const { username, password, registrationNumber } = req.body;
    const existingUser = await User.findOne({ username });

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

    const payload = { username, password, registrationNumber };

    const token = sign(payload, process.env.SECRET_KEY);
    res.cookie("some-secret-token", token, {
      httpOnly: true,
      maxAge: 8640000000, // 100 days
    });
    return res.json({ success: true });
  },
  async registerUser(req, res) {
    const { username, password, registrationNumber } = req.body;
    try {
       await User.create({
        username,
        password,
        registrationNumber,
      });
      return res.json({
        success: true,
        user: { username, registrationNumber },
      });
    } catch (err) {
      return res.status(409).json({
        success: false,
        message: "something went wrong when creating the user",
      });
    }
  },
  async testController(req, res) {
    return res.json({ success: true, message: "you are authorized" });
  },
};
