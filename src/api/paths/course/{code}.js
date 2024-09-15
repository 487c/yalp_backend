import { CourseModel, inviteCodeGenerator } from "../../models/course.js";
import { UserModel } from "../../models/user.js";
import { reduceObject } from "../../services/utils.js";

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
  GET: GET,
  parameters: parameters,
};

async function POST(req, res, next) {
  const courseName = req.body.name;
  if (await CourseModel.findOne({ name: courseName })) {
    throw { status: 400, message: "Course with name already existing." };
  }
  const newCourse = await CourseModel.create({
    name: courseName,
    userIds: [req.userId],
    code: inviteCodeGenerator(),
    owner: req.userId,
  });

  res.status(200).json(reduceObject(newCourse.toObject(), ["name", "code"]));
}

POST.apiDoc = {
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
      content: {
        "application/json": {
          schema: {
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

async function GET(req, res, next) {
  const course = await CourseModel.findOne({ code: req.params.code });
  if (!course)
    throw {
      status: 400,
      message: "The course does not exist.",
    };
  if (course && !course.userIds.includes(req.userId)) {
    throw {
      status: 400,
      message: "You are not part of the course.",
    };
  }

  const members = await UserModel.find({
    _id: {
      $in: [course.userIds],
    },
  });

  res.status(200).json(reduceObject(course.toObject(), [""]));
}

GET.apiDoc = {
  summary: "GET the course",
  description: "GETs the course, if the user is owner and ",
  operationId: "GETCourse",
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
