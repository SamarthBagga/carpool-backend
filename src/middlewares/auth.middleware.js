const { verify } = require("jsonwebtoken");

exports.authMiddleware = function (req, res, next) {
  // const loginToken = req.cookies["secret-token"];
  const authHeader = req.headers['Authorization'];
  const loginToken = authHeader.split(" ")[1]

  console.log(loginToken);
  if (!loginToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, user not authenticated" });
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
