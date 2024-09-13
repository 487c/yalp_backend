import { CourseModel } from "../models/course.js";
import { UserModel } from "../models/user.js";

export default {
  POST: POST,
};

async function POST(req, res, next) {
  const course = await CourseModel.findOne({ code: req.body.code });

  if (course.owner !== req.userId)
    throw {
      status: 400,
      message: "You are not owner of the course. Bugger off.",
    };

  const candidate = await UserModel.findOne({
    displayName: req.body.userDisplayName,
  });

  if (!candidate)
    throw {
      status: 400,
      message: "The given name does not correspond to an user.",
    };

  if (course.owner === req.userId)
    throw {
      status: 400,
      message: "You are already owner of the course.",
    };

  course.owner = candidate._id;
  await course.save();
  res.status(200).json({ result: "OK" });
}

POST.apiDoc = {
  summary: "Transfers course Ownership",
  description: "Sets the *Owner* of the Course to another person.",
  operationId: "joinCourse",
  tags: ["Course"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: String,
            },
            userDisplayName: {
              type: String,
            },
          },
          required: ["code", "userDisplayName"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              result: {
                type: String,
                default: "OK",
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
  },
};
