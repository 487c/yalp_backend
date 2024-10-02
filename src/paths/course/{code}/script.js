import Script from "../../../models/script.js";

export default {
  POST: POST,
};

async function POST(req, res) {
  const course = await Script.createScript(req.params.code, req.userId, {
    name: req.body.name,
    description: req.body.description,
    file: req.body.file,
    fileDateModified: req.body.fileDateModified,
  });
  res.status(200).json(course);
}

POST.apiDoc = {
  summary: "Create Script (Metadata)",
  description: `The call creates new script **metadata**, it returns an uuid for uploading the script file.
    Use the function /script/{uuid}/file to upload the script file. 
    Only scripts with a file will be handed out the the client.`,
  operationId: "createScript",
  tags: ["Script"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: String,
            },
            description: {
              type: String,
            },
          },
          required: ["name"],
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
              uuid: {
                type: String,
              },
            },
            required: ["uuid"],
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
