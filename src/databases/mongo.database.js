const { connect } = require("mongoose");

exports.databaseConnection = async function () {
  try {
    await connect(process.env.DB_HOST);
    console.log(`Connected to MongoDB at ${process.env.DB_HOST}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
