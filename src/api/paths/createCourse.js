import { CourseModel, inviteCodeGenerator } from "../models/course.js";
import { reduceObject } from "../services/utils.js";

export default {
  PUT: PUT,
};

async function PUT(req, res, next) {
  const courseName = req.body.name;
  if (await CourseModel.findOne({ name: courseName })) {
    throw { status: 400, message: "Course with name already existing." };
  }
  const newCourse = await CourseModel.create({
    name: courseName,
    userIds: [req.userId],
    code: inviteCodeGenerator(),
    creator: req.userId,
  });

  res.status(200).json(reduceObject(newCourse.toObject(), ["name", "code"]));
}

PUT.apiDoc = {
  summary: "Create new course",
  description: "Writes a new Course to the database",
  operationId: "createCourse",
  tags: ["Course"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: String,
            },
          },
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
              name: {
                type: String,
              },
              code: {
                type: String,
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
