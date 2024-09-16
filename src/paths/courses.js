import { CourseModel } from "../models/course.js";

export default {
  GET: GET,
};

async function GET(req, res, next) {
  try {
    const courses = await CourseModel.find({ userIds: req.userId });

    res.status(200).json(courses.map((f) => ({ name: f.name, code: f.code })));
  } catch (e) {
    res.status(500).json(e.toString());
  }
}

GET.apiDoc = {
  summary: "Read all courses",
  description: "Gets all courses in which the user is member in.",
  operationId: "getCourses",
  tags: ["Course"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              courses: {
                type: "array",
                items: {
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
