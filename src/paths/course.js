import Course from "../models/course.js";

export default {
  POST: POST,
};

async function POST(req, res, next) {
  const courseName = req.body.name;
  try {
    if (!courseName)
      throw {
        status: 400,
        message: "Missing course name",
      };
    const newCourse = await Course.create({
      name: courseName,
      owner: req.userId,
    });

    res.status(200).json(newCourse);
  } catch (e) {
    throw { status: 400, message: e.toString() };
  }
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
