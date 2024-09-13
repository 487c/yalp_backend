import { CardSchema } from "./models/card.js";
import { CourseSchema } from "./models/course.js";
import { ScriptSchema } from "./models/script.js";
import { UserSchema } from "./models/user.js";

export default {
  openapi: "3.0.0",
  info: {
    title: "REST für das Backend von  'Yet another learning platform'",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
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
          code: { type: String },
          message: { type: String },
        },
        required: ["code", "message"],
      },
      UserSchema,
      ScriptSchema,
      CourseSchema,
      CardSchema,
    },
    responses: {
      InvalidRequest: {
        description: "The Request was invalid.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      NotFound: {
        description: "The specified Ressource was not found.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      MissingToken: {
        description: "Token needed to authorize the request.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      InvalidToken: {
        description: "Token is invalid.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  tags: [
    {
      description: "Registering, Authentification etc.",
      name: "User",
    },
    {
      description: "CRUD for Courses",
      name: "Course",
    },
  ],
  paths: {},
};
