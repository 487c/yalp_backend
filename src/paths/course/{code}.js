import Course from "../../models/course.js";

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
  GET: GET,
  PATCH: PATCH,
  DELETE: DELETE,
  parameters: parameters,
};
async function GET(req, res, next) {
  try {
    const course = await Course.getCourseForUser(req.params.code, req.userId);
    res.status(200).json(course);
  } catch (e) {
    throw { status: 400, ...e };
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
      description: "Course properties",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: String,
              },
              members: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: String,
                    },
                  },
                },
              },
              scripts: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              code: {
                type: String,
              },
              owner: {
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
      $ref: "#/components/responses/Error",
    },
  },
};

async function PATCH(req, res, next) {
  try {
    const course = await Course.update(req.params.code, req.userId, {
      ...req.body,
    });

    res.status(200).json(course);
  } catch (e) {
    throw { status: 400, ...e };
  }
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
      $ref: "#/components/responses/Error",
    },
  },
};

async function DELETE(req, res, next) {
  try {
    await Course.delete(req.params.code, req.userId);

    res.status(200).json({ result: "OK" });
  } catch (e) {
    throw { status: 400, ...e };
  }
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
    default: {
      $ref: "#/components/responses/Error",
    },
  },
};
