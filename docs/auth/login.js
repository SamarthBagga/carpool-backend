module.exports = {
  post: {
    tags: ["Auth"],
    parameters: [],
    summary: "login",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            properties: {
              email: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login",
        headers: {
          "set-cookie": {
            description: "The JWT token in a cookie",
            schema: {
              type: "string",
            },
            example:
              "secret-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          },
        },
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },
                message: {
                  type: "string",
                  example: "successfully logged in",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Server could not process the request",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                message: {
                  type: "string",
                  example: "Request with the given requestId does not exist",
                },
              },
            },
          },
        },
      },
      401: {
        description: "User verification failed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                message: {
                  type: "string",
                  example: "User does not exist",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Server could not process the request",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                message: {
                  type: "string",
                  example: "Internal Server error",
                },
              },
            },
          },
        },
      },
    },
  },
};
