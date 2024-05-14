const { startSession } = require("mongoose");
const Request = require("../models/request.model");
const Ride = require("../models/ride.model");
// const User = require("../models/user.model");

module.exports = {
    byId: async function (req, res) {
        const { rideId: id } = req.params;
        console.log("why is this being called anyways", id);

        try {
            const rideDetails = await Ride.findById(id)
                .populate("host", "-password -__v -verifiedEmail -createdAt -updatedAt")
                .populate({
                    path: "requests",
                    select: "-__v -updatedAt",
                    populate: {
                        path: "passenger",
                        select: "-password -__v -verifiedEmail -createdAt -updatedAt",
                    },
                })
                .select("-__v");

            console.log(rideDetails);
            return res.json({
                success: true,
                message: "These are the ride details",
                rideDetails,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "could not fetch the ride details",
                err: err,
            });
        }
    },
    getRideDetailById: async function (req, res) {
        const { id } = req.body;
        // const { rideId: id } = req.params;

        try {
            const rideDetails = await Ride.findById(id)
                .populate("host", "-password -__v -verifiedEmail -createdAt -updatedAt")
                .populate({
                    path: "requests",
                    select: "-__v -updatedAt",
                    populate: {
                        path: "passenger",
                        select: "-password -__v -verifiedEmail -createdAt -updatedAt",
                    },
                })
                .select("-__v");

            console.log(rideDetails);

            return res.json({
                success: true,
                message: "These are the ride details",
                rideDetails,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "could not fetch the ride details",
                err: err,
            });
        }
    },
    async createRide(req, res) {
        try {
            const { from, to, date, capacity, price, description } = req.body;

            if (!from || !to || !date || !capacity) {
                throw new Error("Some field is missing from the body");
            }

            const ride = new Ride({
                host: req.user.id,
                from,
                to,
                date,
                capacity,
                price,
                description,
            });
            const result = await ride.save();

            res.status(201).json({
                success: true,
                message: "successfully created the ride",
                ride: result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "failed to create a ride",
                error: err.message,
            });
        }
    },
    async requestRide(req, res) {
        const session = await startSession();
        session.startTransaction();
        try {
            const { rideId } = req.body;

            const ride = await Ride.findById(rideId);

            if (!ride) {
                throw new Error(`Ride with ID: ${rideId} does not exist`);
            }

            const existingRide = Request.find({
                ride: rideId,
                passenger: req.user.id,
            });
            if (existingRide) {
                throw new Error("Request to the same already exists");
            }

            const request = new Request({
                ride: rideId,
                passenger: req.user.id,
            });
            const savedRequest = await request.save({ session });

            ride.requests.addToSet(request._id);
            await ride.save({ session });

            const populatedRequest = await savedRequest.populate({
                path: "ride",
                select: "-requests",
            });

            await session.commitTransaction();

            res.status(201).json({
                success: true,
                message: "successfully sent request to join",
                requestTicket: populatedRequest,
            });
        } catch (err) {
            await session.abortTransaction();

            res.status(500).json({
                success: false,
                message: "Could not send the request to join",
                error: err.message,
            });
        } finally {
            await session.endSession();
        }
    },
    async cancelRequest(req, res) {
        const { requestId } = req.body;

        const session = await startSession();
        session.startTransaction();

        try {
            // const result = await Request.findByIdAndDelete(requestId);
            const existingRequest = await Request.findById(requestId, {
                session,
            });
            if (!existingRequest) {
                throw new Error(`Request with the given requestId: ${requestId} does not exist`);
            }
            const existingRide = await Ride.findById(existingRequest.ride);
            if (!existingRide) {
                throw new Error("Successfully cancelled the request to the ride");
            }
            existingRide.requests = existingRide.requests.filter((request) => request.toString() !== requestId);
            await existingRide.save();
            await existingRequest.deleteOne(requestId, { session });
            await session.commitTransaction();

            return res.json({
                success: true,
                message: "Deleted the request with the given requestId",
            });
        } catch (e) {
            await session.abortTransaction();
            return res.status(500).json({
                success: false,
                message: "something went wrong while cancelling the request",
            });
        }
    },
    async updateStatus(req, res) {
        const { requestId, status } = req.body;

        if (!requestId || !status) {
            return res.json({
                success: false,
                message: "need to provide both requestId and status",
            });
        }

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.json({ success: false, message: "invalid status" });
        }

        const session = await startSession();
        session.startTransaction();

        try {
            const requestDocument = await Request.findById(requestId).populate({
                path: "ride",
                select: { host: 1 },
            });

            if (!requestDocument) {
                throw new Error("No request with the given id");
            }

            if (req.user.id !== requestDocument.ride.host.toString()) {
                throw new Error("Only host of the ride can update the status");
            }

            // DISABLING THIS VALIDATION
            // if (status === "approved" && requestDocument.status !== "pending") {
            //   throw new Error(
            //     `Invalid status transition ${requestDocument.status} -> ${status}`,
            //   );
            // }

            if (status === "approved") {
                const ride = await Ride.findById(
                    requestDocument.ride._id,
                    {
                        requests: 1,
                        capacity: 1,
                        _id: 0,
                    },
                    { session }
                );
                if (ride.requests.length >= ride.capacity) {
                    throw new Error("ride is full, cannot add more passengers");
                }
            }

            requestDocument.status = status;
            await requestDocument.save({ session });

            await session.commitTransaction();
            res.json({
                success: true,
                message: `successfully updated the status of the request to ${status}`,
            });
        } catch (err) {
            await session.abortTransaction();
            res.json({
                success: false,
                message: "could not update status of the request",
                error: err.message,
            });
        } finally {
            await session.endSession();
        }
    },
    async getUserRideRequests(req, res) {
        const userId = req.user.id;
        try {
            const requests = await Request.find({ passenger: userId })
                .populate({
                    path: "ride",
                    select: "-requests -__v",
                    options: { distinct: true },
                    populate: {
                        path: "host",
                        select: "-__v -_id -verifiedEmail -password -createdAt -updatedAt",
                    },
                })
                .select({ _id: 1, ride: 1, status: 1 });

            return res.json({
                success: true,
                message: "these are the rides user has requested to be in",
                user: {
                    userId: req.user.id,
                    email: req.user.email,
                },
                requests: requests,
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: `could not fetch requests made by the userid: ${userId}`,
            });
        }
    },
    async searchRides(req, res) {
        const { from, to, date } = req.body;
        try {
            const rides = await Ride.find({ from, to, date }).populate({
                path: "host",
                select: "-password -verifiedEmail -__v",
            });
            res.json({
                success: true,
                message: "these are the rides that match the given parameters",
                rides,
            });
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                message: "error in fetching rides with the given parameters",
            });
        }
    },
    async getUserRideHistory(req, res) {
        try {
            const { id: user_id } = req.user;

            const passengerRequests = await Request.find({
                passenger: user_id,
                status: "approved",
            })
                .select("ride")
                .populate("ride");

            const passengerRides = passengerRequests.map((request) => request.ride);

            const hostRides = await Ride.find({ host: user_id });

            return res.status(200).json({
                success: true,
                message: "This is the previous ride history of the given user",
                rides: passengerRides + hostRides,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Could not fetch the ride history for the give user",
            });
        }
    },
    async getCreatedRidesByUser(req, res) {
        const { id } = req.user;
        try {
            const rides = await Ride.find({ host: id }).populate({
                path: "host",
                select: "-password -verifiedEmail",
            });
            console.log(rides);
            return res.json({
                success: true,
                message: "These are the rides created by the given user",
                rides,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: true,
                message: "Could not get the rides created by the user",
            });
        }
    },
    async updateRideDetails(req, res) {
        try {
            const { rideId, ...updatedRideDetails } = req.body;
            console.log(req.body);

            const updatedRide = await Ride.findByIdAndUpdate(rideId, { $set: updatedRideDetails }, { new: true });

            if (!updatedRide) {
                return res.status(404).json({
                    success: false,
                    message: `The ride with the given ID: ${rideId} does not exist`,
                });
            }

            return res.status(200).json({
                success: true,
                message: "ride details have been updated",
                ride: updatedRide,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: true,
                message: "could not update the ride details",
                error: error.message,
            });
        }
    },
};
