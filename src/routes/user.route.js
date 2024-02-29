const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const router = express.Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get ride details by ID
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Ride details retrieved successfully
 *         headers:
 *          Set-Cookie:
 *            description: Authentication JWT is being returned in the form of Cookie, include it in any protected routes.
 *            schema:
 *              type: string
 *              example: secret-token=j3oh42o4nho; Path=/;
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/definitions/User'
 */
router.get("/profile", authMiddleware, userController.getUserProfile);

module.exports = router;

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       ratingStats:
 *         type: object
 *         properties:
 *           totalRatings:
 *             type: number
 *           averageRating:
 *             type: number
 *             description: "Average rating of the user, should be between 0 and 5."
 *             minimum: 0
 *             maximum: 5
 */
