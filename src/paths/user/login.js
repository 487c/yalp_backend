import { UserModel } from "../../models/user.js";
import { generateAccessToken } from "../../services/authMiddleware.js";

export default {
  parameters: [],
  // method handlers may just be the method handler...
  POST: POST,
};

async function POST(req, res) {
  try {
    const login = req.body.login;
    if (!login) {
      res.status(404).json({ status: 404, message: "Login not given." });
      return;
    }
    const user = await UserModel.findOne({ login: login });

    if (!user) {
      res.status(404).json({ status: 404, message: "User not found." });
      return;
    }

    res.status(200).json({
      token: generateAccessToken(user._id),
      expiresInSeconds: process.env.TOKEN_DURATION_SECONDS,
      timestamp: new Date().valueOf(),
    });
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
