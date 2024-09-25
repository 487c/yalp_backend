import Course from "../../../models/course.js";

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
  POST: POST,
  parameters: parameters,
};

/**
 * TODO: Implement the function for getting the branch
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
  summary: "Read the script file",
  description:
    "Reads current file for the script.",
  operationId: "getScriptFile",
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

async function POST(req, res, next) {
  try {
    const course = await Course.update(req.params.code, req.userId, {
      ...req.body,
    });

    res.status(200).json(course);
  } catch (e) {
    throw { status: 400, message: e.toString() };
  }
}

POST.apiDoc = {
  summary: "Upload into Script",
  description: "Uploads a file to the script. The max size of the file is 16 MB.",
  operationId: "uploadFile",
  tags: ["Script"],
  requestBody: {
    content: {
      "multipart/formdata": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: Blob,
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