const { verify } = require("jsonwebtoken");

exports.authMiddleware = function (req, res, next) {
  const loginToken = req.cookies["secret-token"];
  if (!loginToken) {
    return res
      .status(401)
      .json({ success: false, message: "you are not authorized" });
  }
  try {
    const decodedUser = verify(loginToken, process.env.SECRET_KEY);
    req.user = decodedUser;
    console.log("verified", decodedUser);
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "you are not authorized",
    });
  }
};
