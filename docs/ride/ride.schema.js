const userSchema = require("../user/user.schema");

module.exports = {
  type: "object",
  properties: {
    host: {
      ...userSchema,
    },
    from: {
      type: "string",
      example: "Delhi, India",
    },
    to: {
      type: "string",
      example: "Jaipur, Rajasthan, India",
    },
    capacity: {
      type: "number",
      example: 8,
    },
    price: {
      type: "string",
      example: "Rs. 900",
    },
    date: {
      type: "string",
      example: "2024-02-28T11:29:48.299Z",
    },
    description: {
      type: "string",
    },
    requests: {
      type: "array",
      example: []
    },
  },
};
