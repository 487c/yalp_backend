import Script from "../../../models/script.js";

const parameters = [
  {
    name: "code",
    in: "path",
    schema: {
      type: "string",
    },
    example: "MATHISGREAT101",
    required: true,
    description: "The id of the course",
  },
];

export default {
  POST: POST,
  parameters: parameters,
};



async function POST(req, res) {
  const course = await Script.create(req.params.code, req.userId, {
    name: req.body.name,
    description: req.body.description,
    file: req.body.file,
    fileDateModified: req.body.fileDateModified,
  });
  res.status(200).json(course);
}

POST.apiDoc = {
  summary: "Create Script with pdf file",
  description: `Upload file as base64 encoded with metadata`,
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
              example: "Mathe3"
            },
            description: {
              type: String,
              example: "Das werden sie nie wieder brauchen."
            },
            fileName: {
              type: String,
              example: "mathe3.pdf"
            },
            file: {
              type: String,
              example: "ABCDK313KD"
            },
            fileDateModified: {
              type: String, 
              format: "date-time",
              example: "2018-03-20T09:12:28Z"
            }  
          },
          required: ["name"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Script",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Script",
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
