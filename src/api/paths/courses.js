import { CourseModel, inviteCodeGenerator } from "../models/course.js";

export default {
  parameters: [],
  // method handlers may just be the method handler...
  //   POST: POST,
  GET: GET,
  PUT: PUT,
  // POST: [verifyToken, POST],
};

async function GET(req, res, next) {
  try {
    const courses = await CourseModel.find({ userIds: req.userId });

    res.status(200).json(courses.map((f) => ({ name: f.name, code: f.code })));
  } catch (e) {
    res.status(500).json(e.toString());
  }
}

GET.apiDoc = {
  summary: "Courses for currentUser",
  description: "Gets all courses for a given user.",
  operationId: "getCourses",
  tags: ["Course"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              courses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: String,
                    },
                    code: {
                      type: String,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "Missing Token",
    },
    403: {
      description: "Token invalid.",
    },
  },
};

async function PUT(req, res, next) {
  const courseName = req.body.name;
  CourseModel.create({
    name: courseName,
    userIds: [req.userId],
    code: inviteCodeGenerator(),
  });
  res.status(200).json("OK");
}

PUT.apiDoc = {
  summary: "Create new course",
  description: "Writes a new Course to the database",
  operationId: "createCourse",
  tags: ["Course"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: String,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
    },
    401: {
      description: "Missing Token",
    },
    403: {
      description: "Token invalid.",
    },
  },
};

// async function POST(req, res) {
//   try {
//     const login = req.body.login;
//     const user = await UserModel.findOne({ login: login });
//     if (!user) {
//       res.status(404).json("User not found.");
//       return;
//     }

//     res.status(200).json({
//       token: generateAccessToken(login),
//       expiresInSeconds: process.env.TOKEN_DURATION_SECONDS,
//       timestamp: new Date().valueOf(),
//     });
//   } catch (e) {
//     res.status(503).json(e.toString());
//   }
// }

// POST.apiDoc = {
//   summary: "Generate JWT Token",
//   description:
//     "Looks the user up in the database (needs registering) and returns a jwt token if he exits.",
//   operationId: "login",
//   tags: ["User"],
//   consumes: ["application/json"],
//   parameters: [
//     {
//       name: "login",
//       in: "body",
//       description: "The login of the user.",
//       schema: {
//         required: ["login"],
//         type: "object",
//         properties: {
//           login: {
//             type: String,
//           },
//         },
//       },
//     },
//   ],

//   responses: {
//     200: {
//       description: "Successfull login, token",
//       schema: {
//         type: "object",
//         properties: {
//           token: {
//             type: String,
//           },
//           expiresInSeconds: {
//             type: Number,
//           },
//           timestamp: {
//             type: Number,
//             default: new Date().valueOf(),
//           },
//         },
//       },
//     },

//     // default: {
//     //   description: "Unexpected error",
//     //   schema: {
//     //     $ref: "#/definitions/Error",
//     //   },
//     // },
//   },
// };
