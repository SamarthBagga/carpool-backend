const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

function configurationOptions(PORT) {
  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Carpool API",
        version: "1.0.0",
        description: "API for managing rides",
      },
      servers: [
        {
          url: "https://carpool-backend-muj.onrender.com",
          description: "Production Server on Render",
        },
        {
          url: `http://localhost:${PORT}`,
          description: "Development Server",
        },
      ],
    },
    apis: ["./src/routes/*.js"],
  };
}

exports.swaggerInit = function (app, port) {
  const specs = swaggerJsdoc(configurationOptions(port));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
