import Course from "../models/course.js";

export default {
  POST: POST,
};

async function POST(req, res, next) {
  const courseName = req.body.name;
  if (Course.testForName(courseName)) {
    throw { status: 400, message: "Course with name already existing." };
  }

  const newCourse = await Course.createCourse({
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
