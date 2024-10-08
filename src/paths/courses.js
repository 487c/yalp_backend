import Course from "../models/course.js";

export default {
  GET: GET,
};

async function GET(req, res) {
  const courses = await Course.getReducedCoursesForUser(req.userId);

  res.status(200).json(courses);
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
            type: "array",
            items: {
              $ref: "#/components/schemas/ReducedCourse",
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
