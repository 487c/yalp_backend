import Card from "../../models/card.js";

const parameters = [
  {
    name: "id",
    in: "path",
    schema: {
      type: "string",
    },
    example: "62fef46e9af90a018fd01094",
    required: true,
    description: "The id of the card",
  },
];

export default {
  GET,
  PATCH,
  DELETE,
  parameters: parameters,
};

async function GET(req, res) {
  const card = await Card.get(req.params.id, req.userId);
  res.status(200).json(card);
}

GET.apiDoc = {
  summary: "Read the card",
  description: `Reads the card with the given id. \n
    `,
  operationId: "getCard",
  tags: ["Card"],
  responses: {
    200: {
      description: "Card",
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

async function PATCH(req, res) {
  const course = await Card.update(req.params.id, req.userId, {
    front: req.body.front,
    back: req.body.back,
    anchor: req.body.anchor,
  });

  res.status(200).json(course);
}

PATCH.apiDoc = {
  summary: "Updates Card properties",
  description: "Rewrites the properties of a card as name etc.",
  operationId: "updateCard",
  tags: ["Card"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/PatchableCard",
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

async function DELETE(req, res) {
  await Card.delete(req.params.id, req.userId);
  res.status(200).json({ result: "OK" });
}

DELETE.apiDoc = {
  summary: "Deletes a card",
  description: "Deletes the card and removes the references from the decks",
  operationId: "deleteCard",
  tags: ["Card"],
  responses: {
    200: {
      $ref: "#/components/responses/VoidResult",
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
