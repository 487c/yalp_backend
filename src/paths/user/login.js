import User from "../../models/user.js";

export default {
  parameters: [],
  // method handlers may just be the method handler...
  POST: POST,
};

async function POST(req, res) {
  try {
    const login = req.body.login;
    if (!login) throw "Missing login";

    const loginResult = await User.login(login);

    res.status(200).json(loginResult);
  } catch (e) {
    res.status(503).json(e.toString());
  }
}

POST.apiDoc = {
  summary: "Generate JWT Token",
  description:
    "Looks the user up in the database (needs registering) and returns a jwt token if he exits.",
  operationId: "login",
  tags: ["User"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          // required: ["login"],
          properties: {
            login: {
              type: String,
              default: "john",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successfull login, token",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              token: {
                type: String,
              },
              expiresInSeconds: {
                type: Number,
              },
              timestamp: {
                type: Number,
              },
            },
          },
        },
      },
    },

    // default: {
    //   description: "Unexpected error",
    //   schema: {
    //     $ref: "#/definitions/Error",
    //   },
    // },
  },
};
