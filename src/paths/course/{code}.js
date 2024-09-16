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
  PATCH: PATCH,
  GET: GET,
  DELETE: DELETE,
  parameters: parameters,
};

async function PATCH(req, res, next) {
  const course = await CourseModel.findOne({ code: req.params.code });

  const { name } = req.body;
  if (name) course.name = name;

  res.status(200).json({ result: "OK" });
}

PATCH.apiDoc = {
  summary: "Updates course properties",
  description: "Rewrites the properties of a course",
  operationId: "updateCourse",
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
  if (course && !course.members.includes(req.userId)) {
    throw {
      status: 400,
      message: "You are not part of the course.",
    };
  }

  const [members, owner] = await Promise.all([
    UserModel.find().where("_id").in(course.userIds).exec(),
    UserModel.findOne({ _id: course.owner }),
  ]);

  const redCourse = reduceObject(course.toObject(), [""]);
  redCourse.members = members;
  redCourse.owner = owner;
  res.status(200).json();
}

GET.apiDoc = {
  summary: "Read course properties",
  description:
    "Reads the course properties. Allowed if the user is part of the course. ",
  operationId: "getCourse",
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

async function DELETE(req, res, next) {
  const course = await CourseModel.findOne({ code: req.params.code });
  if (!course)
    throw {
      status: 400,
      message: "The course does not exist.",
    };
  if (course && !course.owner !== req.userId) {
    throw {
      status: 400,
      message: "You are not the course owner",
    };
  }

  if (course.member.length > 1 && course.members) {
    throw {
      status: 400,
      message: "You are not the course owner",
    };
  }

  const [members, owner] = await Promise.all([
    UserModel.find().where("_id").in(course.userIds).exec(),
    UserModel.findOne({ _id: course.owner }),
  ]);

  const redCourse = reduceObject(course.toObject(), [""]);
  redCourse.members = members;
  redCourse.owner = owner;
  res.status(200).json();
}

DELETE.apiDoc = {
  summary: "Deletes the course",
  description: "Deletes a course if it is empty and you are course owner.",
  operationId: "deleteCourse",
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
