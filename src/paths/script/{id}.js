import Script from "../../models/script.js";

const parameters = [
  {
    name: "id",
    in: "path",
    schema: {
      type: "string",
    },
    example: "66fdc364ec1a0050d720b667",
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

async function GET(req, res) {
  const course = await Script.getScriptForUser(req.params.uuid, req.userId);
  res.status(200).json(course);
}

GET.apiDoc = {
  summary: "Read the script metadata",
  description: `Reads the script properties. \n
    Allowed if the user is part of the course. \n
    `,
  operationId: "getCourse",
  tags: ["Script"],
  responses: {
    200: {
      $ref: "#/components/responses/ScriptResponse",
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

async function PATCH(req, res) {
  const course = await Script.update(req.params.code, req.userId, {
    ...req.body,
  });

  res.status(200).json(course);
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

async function DELETE(req, res) {
  await Script.delete(req.params.code, req.userId);
  res.status(200).json({ result: "OK" });
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
