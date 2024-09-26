import Course from "../../../models/course.js";

export default {
  PATCH: PATCH,
};

async function PATCH(req, res, next) {
  Course.changeOwner(req.params.code, req.userId, req.body.user);
  res.status(200).json({ result: "OK" });
}

PATCH.apiDoc = {
  summary: "Transfers course ownership",
  description: "Sets the *Owner* of the Course to another person.",
  operationId: "changeOwner",
  tags: ["Course"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            user: {
              type: String,
            },
          },
          required: ["user"],
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
            type: "object",
            properties: {
              result: {
                type: String,
                default: "OK",
              },
            },
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
