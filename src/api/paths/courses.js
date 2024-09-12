import { verifyToken } from "../services/authMiddleware.js";

export default {
  parameters: [],
  // method handlers may just be the method handler...
  //   POST: POST,
  GET: [verifyToken, GET],
  // PUT: [verifyToken, PUT],
  // POST: [verifyToken, POST],
};

async function GET(req, res, next) {
  try {
    const username = req.user.username;
    
  } catch (e) {
    res.status(500).json(e.toString());
  }
}

GET.apiDoc = {
  summary: "Courses for a User",
  description: "Gets all courses for a given user.",
  operationId: "getCourses",
  tags: ["Course"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "OK",
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
