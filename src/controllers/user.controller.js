const User = require("../models/user.model");

module.exports = {
  async getUserProfile(req, res) {
    const { id: userId } = req.user;

    try {
      const userProfile = await User.findById(userId)
        .select("-password -__v -verifiedEmail -updatedAt")
        .lean();
      if (!userProfile) {
        return res.status(404).json({
          success: false,
          message: "user profile not found",
        });
      }
      res.json({
        success: true,
        message: "Done fetching user profile",
        userProfile,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Could not fetch user profile",
        error: err.message,
      });
    }
  },
};
