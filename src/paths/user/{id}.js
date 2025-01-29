import User from "../../models/user.js";

const parameters = [
  {
    name: "id",
    in: "path",
    schema: {
      type: "string",
    },
    example: "670538fcc348c69519024e7c",
    required: true,
    description: "The user id",
  },
];

export default {
  GET,
  parameters: parameters,
};

async function GET(req, res) {
  const user = await User.getReduced(req.params.id);
  res.status(200).json(user);
}

GET.apiDoc = {
  summary: "Reads the reduces User Information.",
  operationId: "getUserReduced",
  tags: ["User"],
  responses: {
    200: {
      description: "Reduced User Informations",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: String,
                example: "Jane doe",
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
