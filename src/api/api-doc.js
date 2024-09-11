export default {
  swagger: "2.0",
  basePath: "/",
  info: {
    title: "Backend für Yet another learning platform",
    version: "1.0.0",
  },
  definitions: {
    User: {
      type: "object",
      properties: {
        guid: {
          type: "number",
        },
        mail: {
          type: "string",
        },
      },
      required: ["guid", "mail"],
    },
    Script: {
      type: "object",
      properties: {
        guid: {
          type: "string",
        },
        name: {
          type: "string",
        },
        courseGuid: {
          type: "string",
        },
      },
      required: ["guid", "message", "courseGuid"],
    },
    Course:{
      type: "object",
      properties:{
        guid:{
          type:"string",
        }
      }
    }
  },
  paths: {},
};
