import { CardSchema } from "./models/card.js";
import { CourseSchema } from "./models/course.js";
import { ScriptSchema } from "./models/script.js";
import { UserSchema } from "./models/user.js";

export default {
  openapi: "3.0.0",
  info: {
    title: "Backend für Yet another learning platform",
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
        additionalProperties: true,
      },
      UserSchema,
      ScriptSchema,
      CourseSchema,
      CardSchema,
    },
  },
  paths: {},
};

// export default {
//   swagger: "2.0",
//   basePath: "/",
//   info: {
//     title: "Backend für Yet another learning platform",
//     version: "1.0.0",
//   },
//   definitions: {
//     Error: {
//       additionalProperties: true,
//     },
//     UserSchema,
//     ScriptSchema,
//     CourseSchema,
//     CardSchema,
//   },
//   paths: {},
//   tags: [
//     {
//       description: "Registering, Authentification etc.",
//       name: "User",
//     },
//     {
//       description: "Fetching, Creating, Deleting, Courses",
//       name: "Courses",
//     },
//   ],
// };
