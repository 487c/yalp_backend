import express from "express";
import mongoose from "mongoose";
import { initialize } from "express-openapi";
import apiDoc from "./api/api-doc.js";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { verifyToken } from "./api/services/authMiddleware.js";
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
app.use(express.json());
app.use(cors());
app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "http://localhost:3000/api-docs",
    },
  })
);

/* Handling von Fehlern  */
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  if (typeof err.message === "string") {
    res.send(err.message);
  } else {
    res.json(err.message);
  }
});

/* Laden des OpenApi Geräts */
await initialize({
  app,
  apiDoc: apiDoc,
  dependencies: {},
  securityHandlers: {
    bearerAuth: verifyToken,
  },
  pathSecurity: [[/^\/courses/, [{ bearerAuth: [] }]]],
  paths: "src/api/paths",
});


app.listen(3000);

console.log("Backend Running.");
