import User from "../models/user.js";

export default {
  GET,
  PATCH,
};

async function GET(req, res) {
  const user = await User.get(req.userId);
  res.status(200).json(user);
}

GET.apiDoc = {
  summary: "Read User",
  description: `Reads User profile`,
  operationId: "getUser",
  tags: ["User"],
  responses: {
    200: {
      description: "User Profile",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
    400: {
      $ref: "#/components/responses/InvalidRequest",
    },
    401: {
      $ref: "#/components/responses/MissingToken",
    },
    403: {
      $ref: "#/components/responses/InvalidToken",
    },
    default: {
      $ref: "#/components/responses/Error",
    },
  },
};

async function PATCH(req, res) {
  const course = await User.update(req.userId, req.body);

  res.status(200).json(course);
}

PATCH.apiDoc = {
  summary: "Update User Profile",
  description: "Updates User profile.",
  operationId: "updateUser",
  tags: ["User"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/User",
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
    400: {
      $ref: "#/components/responses/InvalidRequest",
    },
    401: {
      $ref: "#/components/responses/MissingToken",
    },
    403: {
      $ref: "#/components/responses/InvalidToken",
    },
    default: {
      $ref: "#/components/responses/Error",
    },
  },
};
