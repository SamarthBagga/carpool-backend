const userProfile = require("./userProfile");
const security = require("../security");

module.exports = {
  "/user/profile": {
    security: [
      {
        JWTAuthCookie: [],
      },
    ],
    ...userProfile,
  },
};
