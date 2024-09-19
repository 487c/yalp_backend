import Course from "../../models/course.js";
import { UserModel } from "../../models/user.js";
import { reduceObject } from "../../services/utils.js";

const parameters = [
  {
    name: "code",
    in: "path",
    schema: {
      type: "string",
    },
    example: "MATHISGREAT101",
    required: true,
    description: "Referral code of the course",
  },
];

export default {
  PATCH: PATCH,
  GET: GET,
  DELETE: DELETE,
  parameters: parameters,
};

async function PATCH(req, res, next) {
  const course = await Course.updateCourse({
    ...req.body,
    code: req.params.code,
    owner: req.userId,
  });

  res.status(200).json(course);
}

PATCH.apiDoc = {
  summary: "Updates course properties",
  description: "Rewrites the properties of a course",
  operationId: "updateCourse",
  tags: ["Course"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: String,
              example: "Math for beginners",
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
    default: {
      $ref: "#/components/responses/InvalidRequest",
    },
  },
};

async function GET(req, res, next) {
  try {
    const course = await Course.getCourseForUser(req.params.code, req.userId);
    if (!course)
      throw {
        status: 400,
        message: "Course not found / you are not a member of this course",
      };
    res.status(200).json(course);
  } catch (e) {
    throw {
      status: 400,
      message: e,
    };
  }
}

GET.apiDoc = {
  summary: "Read course properties",
  description:
    "Reads the course properties. Allowed if the user is part of the course. ",
  operationId: "getCourse",
  tags: ["Course"],
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

async function DELETE(req, res, next) {
  const course = await Course.deleteCourse({ code: req.params.code });
}

DELETE.apiDoc = {
  summary: "Deletes the course",
  description: "Deletes a course if it is empty and you are course owner.",
  operationId: "deleteCourse",
  tags: ["Course"],
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
