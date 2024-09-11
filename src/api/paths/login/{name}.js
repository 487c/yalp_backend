export default {
  // parameters for all operations in this path
  parameters: [
    {
      name: "name",
      in: "path",
      type: "string",
      required: true,
      description: "UserName",
    },
  ],
  // method handlers may just be the method handler...
  get: get,
};

function get(req, res) {
  try {
    const name = req.params.name;
  } catch (e) {}
  res.status(200).json({
    token: "ABC",
  });
}

get.apiDoc = {
  description: "Get a token from the server",
  operationId: "login",
  tags: ["Authentification"],
  parameters: [
    {
      name: "name",
      in: "path",
      type: "string",
      // pattern: "",
      required: true,
      description: "The name of the user.",
    },
  ],

  responses: {
    200: {
      description: "Successfull login, token",
      schema: {
        type: "object",
        properties: {
          token: {
            type: "string",
          },
        },
      },
    },

    // default: {
    //   description: "Unexpected error",
    //   schema: {
    //     $ref: "#/definitions/Error",
    //   },
    // },
  },
};
