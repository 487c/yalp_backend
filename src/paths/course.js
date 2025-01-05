import Course from "../models/course.js";
import ErrorCodes from "../services/errorCodes.js";

export default {
  POST: POST,
};

async function POST(req, res) {
  const courseName = req.body.name;
  if (!courseName) throw ErrorCodes(2009);
  const newCourse = await Course.create({
    name: courseName,
    owner: req.userId,
  });

  res.status(200).json(newCourse);
}

POST.apiDoc = {
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
    default: {
      $ref: "#/components/responses/InvalidRequest",
    },
  },
};
