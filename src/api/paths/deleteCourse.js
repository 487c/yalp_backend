import { CourseModel } from "../models/course.js";

export default {
  DELETE: DELETE,
};

async function DELETE(req, res, next) {
  const course = await CourseModel.findOne({ code: req.body.code });
  if (course && course.creator === req.userId && course.userIds.length === 1) {
    if (course.userIds[0] === req.userId) {
      await course.deleteOne();
      res.status(200).json({ result: "OK" });
    } else {
      throw {
        status: 400,
        message: "You are not the last user in the course.",
      };
    }
  } else {
    throw {
      status: 400,
      message:
        "You are not the course creator, or the course has to many members left.",
    };
  }
}

DELETE.apiDoc = {
  summary: "Delte the course",
  description: "Deletes the course, if the user is creator and ",
  operationId: "deleteCourse",
  tags: ["Course"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: String,
            },
          },
          required: ["code"],
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
  },
};
