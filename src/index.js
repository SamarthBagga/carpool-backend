const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoute = require("./routes/auth.route");
const rideRoute = require("./routes/ride.route");
const userRoute = require("./routes/user.route");
const defaultRoute = require("./routes/default.route");
const { databaseConnection } = require("./databases/mongo.database");
const { corsOptions } = require("./configs/cors.config");
const { swaggerInit } = require("./configs/swagger.config");

const PORT = process.env.SERVER_PORT || 7000;

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);
app.use("/api/user", userRoute);

const swaggerUi = require("swagger-ui-express");
const docs = require("../docs");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
app.use("*", defaultRoute);

async function main() {
  try {
    await databaseConnection();
    app.listen(PORT, () => console.log("server listening at", PORT));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
