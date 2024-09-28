import User from "./models/user.js";
import Script from "./models/script.js";
import Card from "./models/card.js";

export default {
  openapi: "3.0.0",
  info: {
    title: "REST für das Backend von  'Yet another learning platform'",
    version: "0.0.1",
  },
  servers: [
    {
      url: "/api",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          status: { type: String },
          code: { type: String },
          message: { type: String },
        },
        required: ["status", "message"],
      },
      ReducedUserSchema: User.getReducedSchema(),
      // ReducedCourseSchema: Course.getReducedSchema(),
      ReducedScriptSchema: Script.getReducedSchema(),
      ReducedCardSchema: Card.getReducedSchema(),
    },
    responses: {
      Error: {
        description: "Error Response",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      InvalidRequest: {
        description: "The Request was invalid. Check Paramaters and Body.",
      },
      NotFound: {
        description: "The specified Ressource was not found.",
      },
      MissingToken: {
        description: "Token needed to authorize the request.",
      },
      InvalidToken: {
        description: "Token is invalid.",
      },
    },
  },
  tags: [
    {
      description: "Registering, Authentification etc.",
      name: "User",
    },
    {
      description: "Operation for Courses",
      name: "Course",
    },
    {
      description: "Operations for Scripts",
      name: "Script",
    },
  ],
  paths: {},
};
