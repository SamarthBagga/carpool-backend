const express = require("express");
const rideController = require("../controllers/ride.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .post("/create", authMiddleware, rideController.createRide)
  .post("/request", authMiddleware, rideController.requestRide)
  .post("/update-status", authMiddleware, rideController.updateStatus)
  .get("/user", authMiddleware, rideController.getUserRides);

module.exports = router;
