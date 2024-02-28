const express = require("express");
const rideController = require("../controllers/ride.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .post("/create", authMiddleware, rideController.createRide)
  .post("/request", authMiddleware, rideController.requestRide)
  .post("/search", authMiddleware, rideController.searchRides)
  .post("/update-status", authMiddleware, rideController.updateStatus)
  .post("/cancel", authMiddleware, rideController.cancelRequest)
  .post("/", authMiddleware, rideController.getRideDetailById)
  .get("/user-ride-history", authMiddleware, rideController.getUserRideHistory)
  .get("/user-created", authMiddleware, rideController.getCreatedRidesByUser)
  .get("/user-requests", authMiddleware, rideController.getUserRideRequests);

module.exports = router;
