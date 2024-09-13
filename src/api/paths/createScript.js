import { ScriptModel } from "../models/script.js";
import { reduceObject } from "../services/utils.js";

export default {
  PUT: PUT,
};

async function PUT(req, res, next) {
  const documentDefinition = req.body;
  throw { status: 400, message: "Path not yet implemented" };
}

PUT.apiDoc = {
  summary: "Create a new Script",
  description:
    "Uploade a new script, stores it, transfers it to markdown and classifies it.",
  operationId: "createScript",
  tags: ["Script"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            displayName: {
              type: String,
            },
            fileName: {
              type: String,
            },
            base64Content: {
              type: String,
            },
            documentDate: {
              type: String,
            },
          },
          required: ["displayName", "fileName", "base64Content", "documentDate"],
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
              result: {
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
