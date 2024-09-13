import { UserModel } from "../models/user.js";

export default function () {
  const operations = {
    POST,
  };

  function POST(req, res, next) {
    try {
      const login = req.body.login;
      if (!/^\w{10,}$/g.test(login)) {
        throw{status:400, message:"The login needs to be longer than 10 characters."}
        return;
      } else {
        UserModel.create(req.body);
        res.status(200).json("OK");
      }
    } catch (e) {
      res.status(500).json(e.toString());
    }
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
    },
  };
  return operations;
}
