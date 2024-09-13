import { CourseModel, inviteCodeGenerator } from "../models/course.js";

export default {
  PUT: PUT,
};

async function PUT(req, res, next) {
  const courseName = req.body.name;
  if (await CourseModel.findOne({ name: courseName })) {
    throw { status: 405, message: "Course with name already existing." };
  }
  const newCourse = await CourseModel.create({
    name: courseName,
    userIds: [req.userId],
    code: inviteCodeGenerator(),
  });
  const obj = newCourse.toObject();
  delete obj.userIds;

  res.status(200).json(obj);
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
    401: {
      $ref: "#/components/responses/MissingToken",
    },
    403: {
      $ref: "#/components/responses/InvalidToken",
    },
  },
};
