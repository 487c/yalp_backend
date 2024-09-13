import { CourseModel } from "../models/course.js";

export default {
  POST: POST,
};

async function POST(req, res, next) {
  const course = await CourseModel.findOne({ code: req.body.code });
  if (course.userIds.includes(req.userId))
    throw {
      status: 400,
      message: "You are already member of the course.",
    };

  course.userIds.push(req.userId);
  course.save();
  res.status(200).json({ result: "OK" });
}

POST.apiDoc = {
  summary: "Join a course",
  description: "Joins the course via code.",
  operationId: "joinCourse",
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
