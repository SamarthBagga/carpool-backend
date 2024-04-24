const { verify } = require("jsonwebtoken");
const {User} = require("../models/user.model")
exports.authMiddleware = async function  (req, res, next) {
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
    const userFromToken = verify(loginToken, process.env.SECRET_KEY)
    const dbUsr = await User.findById(userFromToken.id);
    if(!dbUsr){
      return res.status(401).json({
        success:false,
        message:"Valid token but user does not exists "
      })
    }
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "you are not authorized",
    });
  }
};
