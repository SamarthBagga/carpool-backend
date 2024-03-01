const userSchema = require("../user/user.schema");
const rideSchema = require("./ride.schema");
const status = require("../status-enum");

module.exports = {
  type: "object",
  properties: {
    _id: {
      type: "2024-02-28T11:29:48.299Z",
    },
    passenger: {
      ...userSchema,
    },
    ride: {
      ...rideSchema,
    },
    ...status,
  },
};
