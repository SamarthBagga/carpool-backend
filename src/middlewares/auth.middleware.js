const { verify } = require("jsonwebtoken");

exports.authMiddleware = function (req, res, next) {
  const loginToken = req.cookies["secret-token"];
  console.log(loginToken);
  if (!loginToken) {
    return res
      .status(401)
      .json({ success: false, message: "token not provided" });
  }
  try {
    req.user = verify(loginToken, process.env.SECRET_KEY);
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "you are not authorized",
    });
  }
};
