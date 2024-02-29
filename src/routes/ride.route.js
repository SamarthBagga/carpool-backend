const express = require("express");
const rideController = require("../controllers/ride.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

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
  .get("/user-requests", authMiddleware, rideController.getUserRideRequests)

  // .get("/get/:rideId", authMiddleware, rideController.byId);

module.exports = router;

// /**
//  * @swagger
//  * definitions:
//  *   User:
//  *     type: object
//  *     properties:
//  *       _id: string
//  *       firstName: string
//  *       lastName: string
//  *       email: string
//  *       ratingStats:
//  *        type: object
//  *        properties:
//  *           totalRatings:
//  *             type: number
//  *           averageRating:
//  *             type: number
//  *             description: "Average rating of the user, should be between 0 and 5."
//  *             maximum: 5
//  *             minimum: 0
//  */

// /**
//  * @swagger
//  * definitions:
//  *  Request:
//  *    type: object
//  *    properties:
//  *      passenger:
//  *        $ref: '#/definitions/User'
//  *      ride:
//  *        type: String
//  *      status:
//  *        type: string
//  *        enum:
//  *          - pending
//  *          - approved
//  *          - rejected
//  */

//  *              success: true
//  *              message: string
//  *              rideDetails: { from: string, to: string, capacity: number, description: string, price: number, requests: [{ passenger: { firstName: string, lastName: string, email: string, ratingStats: { averageRating: number, totalRatings: number } }, ride: string, status: string }], createdAt: "2024-02-28T11:29:48.299Z", updatedAt: "2024-02-28T11:29:48.299Z" }

// /**
//  * @swagger
//  * /api/rides/{rideId}:
//  *   get:
//  *     summary: Get ride details by ID
//  *     tags: [Rides]
//  *     parameters:
//  *       - in: path
//  *         name: rideId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The ID of the ride to retrieve details
//  *     responses:
//  *       200:
//  *         description: Ride details retrieved successfully
//  *         content:
//  *           application/json:
//  *            example:
//  *              from: string
//  *              to: string
//  *              requests:
//  *                - $ref: '#/definitions/Request'
//  *       401:
//  *         description: Unauthorized, user not authenticated
//  *         content:
//  *           application/json:
//  *             example:
//  *               success: false
//  *               message: Unauthorized, user not authenticated
//  *       404:
//  *         description: Ride not found
//  *         content:
//  *           application/json:
//  *             example:
//  *               success: false
//  *               message: Ride not found
//  *       500:
//  *         description: Failed to fetch ride details
//  *         content:
//  *           application/json:
//  *             example:
//  *               success: false
//  *               message: Could not fetch the ride details
//  *               error: <error details>
//  */
