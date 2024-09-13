import { UserModel } from "../models/user.js";

export default function () {
  const operations = {
    POST,
  };

  async function POST(req, res, next) {
    const login = req.body.login;
    if (!/^\w{10,}$/g.test(login)) {
      throw {
        status: 400,
        message:
          "The login needs to be longer than 10 characters. It will also act as your password, so choose wisely.",
      };
    }

    if (await UserModel.findOne({ login: res.body.login }))
      throw {
        status: 400,
        message: "That login is already taken... (whatever that implies)",
      };

    if (await UserModel.findOne({ name: res.body.name }))
      throw {
        status: 400,
        message: "That name is already taken.",
      };
    await UserModel.create(req.body);
    res.status(200).json("OK");
  }

  POST.apiDoc = {
    summary: "Creates a new user",
    description:
      "Creates a new user, who then can login and user the system. Function should be hidden from the user.\n \
      The Username is also the password for the service, so a certain length shoudl be enforced. ",
    operationId: "createUser",
    tags: ["User"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserSchema",
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
      },
      400: {
        $ref: "#/components/responses/InvalidRequest",
      },
    },
  };
  return operations;
}
