import Course from "../../models/course.js";

const parameters = [
  {
    name: "uuid",
    in: "path",
    schema: {
      type: "string",
    },
    example: "1e274ba0-b772-4edd-8c04-b5291af2e8bb",
    required: true,
    description: "The uuid of the script",
  },
];

export default {
  GET: GET,
  PATCH: PATCH,
  DELETE: DELETE,
  parameters: parameters,
};

/**
 * TODO: talk about expected result values
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function GET(req, res, next) {
  try {
    const course = await Course.getCourseForUser(req.params.code, req.userId);
    res.status(200).json(course);
  } catch (e) {
    throw { status: 400, message: e.toString() };
  }
}

GET.apiDoc = {
  summary: "Read the script metadata",
  description:
    "Reads the script properties. Allowed if the user is part of the course. ",
  operationId: "getCourse",
  tags: ["Script"],
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

async function PATCH(req, res, next) {
  try {
    const course = await Course.update(req.params.code, req.userId, {
      ...req.body,
    });

    res.status(200).json(course);
  } catch (e) {
    throw { status: 400, message: e.toString() };
  }
}

PATCH.apiDoc = {
  summary: "Updates Script properties",
  description: "Rewrites the properties of a script as name etc.",
  operationId: "updateScript",
  tags: ["Script"],
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
    throw { status: 400, message: e.toString() };
  }
}

DELETE.apiDoc = {
  summary: "Deletes a script (including files)",
  description: "Deletes a script if it is empty and you are course owner.",
  operationId: "deleteScript",
  tags: ["Script"],
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
