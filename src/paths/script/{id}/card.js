import Card from "../../../models/card.js";

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
  const card = await Card.create(req.params.id, req.userId, {
    front: req.body.front,
    back: req.body.back,
  });

  res.status(200).json(card.toJSON());
}

POST.apiDoc = {
  summary: "Upload a file into the script",
  description:
    "Uploads a file to the script. The max size of the file is 16 MB.",
  operationId: "uploadFile",
  tags: ["Script"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ReducedCard",
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
