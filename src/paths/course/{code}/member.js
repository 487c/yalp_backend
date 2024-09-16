import { CourseModel } from "../../../models/course.js";

const parameters = [
  {
    name: "code",
    in: "path",
    schema: {
      type: "string",
    },
    required: true,
    description: "Referral code of the course",
  },
];

export default {
  POST: POST,
  DELETE: DELETE,
  parameters,
};

async function POST(req, res, next) {
  const course = await CourseModel.findOne({ code: req.params.code });
  if (course.userIds.includes(req.userId))
    throw {
      status: 400,
      message: "You are already member of the course.",
    };

  course.userIds.push(req.userId);
  await course.save();
  res.status(200).json({ result: "OK" });
}
POST.apiDoc = {
  summary: "Join a course",
  description: "Joins the course via code.",
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
          },
          required: ["code"],
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

async function DELETE(req, res, next) {
  const course = await CourseModel.findOne({ code: req.params.code });
  if (!course.userIds.includes(req.userId))
    throw {
      status: 400,
      message: "You are not in the course.",
    };

  if (course.owner === req.userId)
    throw {
      status: 400,
      message: "You are the owner of the course. You cant leave it (yet)",
    };

  if (course.userIds.length < 1)
    throw {
      status: 500,
      message:
        "Internal error, there should be more useres than one in the course (You and the owner).",
    };

  course.userIds.splice(course.userIds.indexOf(req.userId), 1);
  await course.save();
  res.status(200).json({ result: "OK" });
}

DELETE.apiDoc = {
  summary: "Leaves a course",
  description: "Leaves a course, if you are not owner of the course.",
  operationId: "leaveCourse",
  tags: ["Course"],
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
