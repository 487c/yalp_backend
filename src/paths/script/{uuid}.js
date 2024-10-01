import Script from "../../models/script.js";

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
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: String,
              },
              dateCreated: {
                type: String,
              },
              description: {
                type: String,
              },
              files: {
                type: "array",
                items: {
                  type: "string",
                  description: "The uuid of the files",
                },
              },
              cards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    uuid: {
                      type: String,
                      description: "The uuid of the card",
                    },
                    front: {
                      type: String,
                      description: "The front of the card",
                    },
                    back: {
                      type: String,
                    },
                    author: {
                      type: String,
                      description: "The uuid of the author.",
                    },
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
