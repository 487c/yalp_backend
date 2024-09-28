import User from "../../models/user.js";

export default function () {
  const operations = {
    POST,
  };

  async function POST(req, res) {
    const user = await User.register({ name: req.body.name, login: req.body.login });
    res.status(200).json(user);
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
            $ref: "#/components/schemas/ReducedUserSchema",
          },
          examples: {
            PeterPan: {
              value: {
                name: "Peter Pan",
                login: "peterpanisSoooStronk",
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
      400: {
        $ref: "#/components/responses/InvalidRequest",
      },
      default: {
        $ref: "#/components/responses/Error",
      },
    },
  };
  return operations;
}
