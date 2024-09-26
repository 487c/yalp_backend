import User from "../../models/user.js";

export default {
  parameters: [],
  // method handlers may just be the method handler...
  POST: POST,
};

async function POST(req, res) {
  try {
    const login = req.body.login;

    const loginResult = await User.login(login);

    res.status(200).json(loginResult);
  } catch (e) {
    throw { status: 400, ...e };
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
              example: "john",
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
    400: {
      $ref: "#/components/responses/InvalidRequest",
    },
    default: {
      $ref: "#/components/responses/Error",
    },
  },
};
