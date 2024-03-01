const basicInfo = require("./basic-info");
const servers = require("./servers");
const components = require("./components");
const users = require("./user");
const rides = require("./ride");

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  paths: {
    ...users,
    ...rides,
  },
};
