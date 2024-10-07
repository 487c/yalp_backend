import Card from "../../models/card.js";

const parameters = [
  {
    name: "id",
    in: "path",
    schema: {
      type: "string",
    },
    example: "66fdc364ec1a0050d720b667",
    required: true,
    description: "The id of the card",
  },
];

export default {
  GET,
  // PATCH, //TODO: Insert Patch path
  // DELETE,
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

// async function PATCH(req, res) {
//   const course = await Card.update(req.params.id, req.userId, {
//     file: req.body.file,
//     modifiedDate: req.body.modifiedDate,
//     name: req.body.name,
//     description: req.body.description,
//   });

//   res.status(200).json(course);
// }

// PATCH.apiDoc = {
//   summary: "Updates Script properties",
//   description: "Rewrites the properties of a script as name etc.",
//   operationId: "updateScript",
//   tags: ["Script"],
//   requestBody: {
//     content: {
//       "application/json": {
//         schema: {
//           type: "object",
//           properties: {
//             name: {
//               type: String,
//               example: "Math for beginners",
//             },
//           },
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: "OK",
//       content: {
//         "application/json": {
//           schema: {
//             type: "object",
//             properties: {
//               name: {
//                 type: String,
//               },
//               code: {
//                 type: String,
//               },
//             },
//           },
//         },
//       },
//     },
//     400: {
//       $ref: "#/components/responses/InvalidRequest",
//     },
//     401: {
//       $ref: "#/components/responses/MissingToken",
//     },
//     403: {
//       $ref: "#/components/responses/InvalidToken",
//     },
//     default: {
//       $ref: "#/components/responses/Error",
//     },
//   },
// };

// async function DELETE(req, res) {
//   await Script.delete(req.params.id, req.userId);
//   res.status(200).json({ result: "OK" });
// }

// DELETE.apiDoc = {
//   summary: "Deletes a script (including files)",
//   description: "Deletes a script if it is empty and you are course owner.",
//   operationId: "deleteScript",
//   tags: ["Script"],
//   responses: {
//     200: {
//       $ref: "#/components/responses/VoidResult",
//     },
//     400: {
//       $ref: "#/components/responses/InvalidRequest",
//     },
//     401: {
//       $ref: "#/components/responses/MissingToken",
//     },
//     403: {
//       $ref: "#/components/responses/InvalidToken",
//     },
//     default: {
//       $ref: "#/components/responses/Error",
//     },
//   },
// };
