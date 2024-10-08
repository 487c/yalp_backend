import Course from "../../../models/course.js";

export default {
  PATCH: PATCH,
};

async function PATCH(req, res) {
  const course = await Course.changeOwner(
    req.params.code,
    req.userId,
    req.body.user
  );
  res.status(200).json(course.toJSON());
}

PATCH.apiDoc = {
  summary: "Transfers course ownership",
  description:`  Sets the *Owner* of the Course to another person. \n
  The new Owner must be part of the course. `,
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
            $ref: "#/components/schemas/Course",
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
