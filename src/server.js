import express from "express";
import mongoose from "mongoose";
import { initialize } from "express-openapi";
import v1WorldsService from "./api/services/worldsService.js";
import apiDoc from "./api/api-doc.js";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

console.log(
  "Connecting to Database: " +
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_USER_PW}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?directConnection=true`
);

const dbConnectResult = await mongoose.connect(
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_USER_PW}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?directConnection=true`
);
console.log("Database connected.");

const app = express();
app.use(express.json())
app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "http://localhost:3000/api-docs",
    },
  })
);
initialize({
  app,
  apiDoc: apiDoc,
  dependencies: {
    worldsService: v1WorldsService,
  },

  paths: "src/api/paths",
});
app.listen(3000);

console.log("Backend Running.");
