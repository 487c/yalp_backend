import { CardSchema } from "./models/card.js";
import { CourseSchema } from "./models/course.js";
import { ScriptSchema } from "./models/script.js";
import { UserSchema } from "./models/user.js";

export default {
  swagger: "2.0",
  basePath: "/",
  info: {
    title: "Backend für Yet another learning platform",
    version: "1.0.0",
  },
  definitions: {
    UserSchema,
    ScriptSchema,
    CourseSchema,
    CardSchema,
  },
  paths: {},
  tags: [
    {
      description: "Authentification",
      name: "Login",
    },
  ],
};
