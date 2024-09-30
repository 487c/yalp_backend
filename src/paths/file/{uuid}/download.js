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
    description: "The uuid of the file",
  },
];

export default {
  GET: GET,
  parameters: parameters,
};

async function GET(req, res) {
  const file = await Script.getFileForUser(req.params.uuid, req.userId);
  res.status(200).json(file);
}

GET.apiDoc = {
  summary: "Read the file metadata",
  description: `Downloads the file as byte stream.\n
  Download the file metadata via GET /api/file/{uuid}/metadata`,
  operationId: "getFileDownload",
  tags: ["File"],
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
