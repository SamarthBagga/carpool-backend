const userSchema = require("../user/user.schema");
const rideSchema = require("./ride.schema");
const status = require("../status-enum");

module.exports = {
  type: "object",
  properties: {
    passenger: {
      ...userSchema,
    },
    ride: {
      ...rideSchema,
    },
    ...status,
  },
};
