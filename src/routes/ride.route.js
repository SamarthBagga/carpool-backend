const express = require("express");
const rideController = require("../controllers/ride.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/rides/{rideId}:
 *   get:
 *     summary: Get ride details by ID
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the ride to retrieve details
 *     responses:
 *       200:
 *         description: Ride details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: These are the ride details
 *               rideDetails:
 *                 host: { _id: string, firstName: string, lastName: string, email: string, ratingStats: { totalRatings: integer, averageRating: integer } }
 *                 from: String
 *                 to: 'string'
 *                 date: 'string'
 *                 capacity: 'number'
 *                 price: 'number'
 *                 description: 'string'
 *                 requests: [
 *                   {
 *                     passenger: {  _id: string, firstName: string, lastName: string, email: string, ratingStats: { totalRatings: integer, averageRating: integer }  },
 *                     status: { type: 'string', enum: ['pending', 'approved', 'rejected'] }
 *                   }
 *                 ]
 *       401:
 *         description: Unauthorized, user not authenticated
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized, user not authenticated
 *       404:
 *         description: Ride not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Ride not found
 *       500:
 *         description: Failed to fetch ride details
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Could not fetch the ride details
 *               error: <error details>
 */
router.get("/:rideId", authMiddleware, rideController.byId);
router
  .post("/", authMiddleware, rideController.getRideDetailById)
  .post("/create", authMiddleware, rideController.createRide)
  .post("/request", authMiddleware, rideController.requestRide)
  .post("/search", authMiddleware, rideController.searchRides)
  .post("/update-status", authMiddleware, rideController.updateStatus)
  .post("/cancel", authMiddleware, rideController.cancelRequest)
  .patch("/update", authMiddleware, rideController.updateRideDetails)
  .get("/user-ride-history", authMiddleware, rideController.getUserRideHistory)
  .get("/user-created", authMiddleware, rideController.getCreatedRidesByUser)
  .get("/user-requests", authMiddleware, rideController.getUserRideRequests);

module.exports = router;
