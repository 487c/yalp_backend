import Card from "../../../models/card.js";

const parameters = [
  {
    name: "id",
    in: "path",
    schema: {
      type: "string",
    },
    example: "66fdc364ec1a0050d720b667",
    required: true,
    description: "The id of the script",
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
    anchor: {
      scriptId: req.params.id,
      context: req.body.anchor?.context,
    },
  });

  res.status(200).json(card.toJSON());
}

POST.apiDoc = {
  summary: "Add a card for the script",
  description: "Creates a new card for the user with anchor to the script.",
  operationId: "createCard",
  tags: ["Card", "Script"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            front: {
              type: String,
              example: "Ersten drei Stellen von pi."
            },
            back: {
              type: String,
              example: "3,13"
            },
            anchor: {
              type: "object",
              properties: {
                context: {
                  type: "array",
                  items: {
                    description: "Kapitel, Unterkapitl, Unterunterkapitel...",
                    type: "number",
                    example: 1
                  },
                },
              },
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
            $ref: "#/components/schemas/Card",
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
