import Script from "../../../models/script.js";

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
 * TODO: Implement the function for getting the file
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function GET(req, res, next) {
    const course = await Course.getCourseForUser(req.params.code, req.userId);
    res.status(200).json(course);

}

GET.apiDoc = {
  summary: "Read the script file",
  description: "Reads current file for the script.",
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
    const course = await Script.setScriptFile(req.params.uuid, req.userId, {
      file: req.files[0],
      name: req.body.name,
      modifiedDate: req.body.modifiedDate,
    });

    res.status(200).json(course);

}

POST.apiDoc = {
  summary: "Upload a file into the script",
  description:
    "Uploads a file to the script. The max size of the file is 16 MB.",
  operationId: "uploadFile",
  tags: ["Script"],
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary",
            },
            name: {
              type: String,
            },
            modifiedDate: {
              type: String,
              example: new Date().valueOf(),
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
