const parameters = [
  {
    name: "id",
    in: "path",
    schema: {
      type: "string",
    },
    example: "1e274ba0-b772-4edd-8c04-b5291af2e8bb",
    required: true,
    description: "The id of the card",
  },
];

export default {
  POST: POST,
  parameters: parameters,
};

async function POST(req, res) {
  // const course = await Script.setScriptFile(req.params.uuid, req.userId, {
  //   file: req.files[0],
  //   name: req.body.name,
  //   modifiedDate: req.body.modifiedDate,
  // });

  res.status(200).json({});
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
