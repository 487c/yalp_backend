import Deck from "../../../models/deck.js";

export default {
  GET,
};

async function GET(req, res) {
  const course = await Deck.get(req.params.code, req.userId);
  res.status(200).json(course.toJSON());
}

GET.apiDoc = {
  summary: "Reads Collection of Cards",
  description: `Gets all cards that are connected with a script for the user.`,
  operationId: "getDeck",
  tags: ["Deck"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Deck",
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
