import express from "express";
import mongoose from "mongoose";
import openapi from "express-openapi";
import apiDoc from "./api-doc.js";
import cors from "cors";
import {
  verifyToken,
  handleError,
  logInfo,
  consumesMiddleware,
  swaggerUiParams,
} from "./services/middlewares.js";
import "dotenv/config";
import loadDemoData from "./services/demoData.js";

const app = express();
app.use(express.json({limit:"20mb"}));
app.use(cors());
app.use(logInfo);
app.use(...swaggerUiParams);

app.listen(process.env.BACKEND_PORT);

/* Laden des OpenApi Geräts */
export default async function () {
  await Promise.all([
    mongoose.connect(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_USER_PW}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?directConnection=true`
    ),
    openapi.initialize({
      app,
      apiDoc: apiDoc,
      dependencies: {},
      securityHandlers: {
        bearerAuth: verifyToken,
      },
      errorMiddleware: handleError,
      consumesMiddleware: consumesMiddleware,
      pathSecurity: [
        [/^\/course/, [{ bearerAuth: [] }]],
        [/^\/script/, [{ bearerAuth: [] }]],
      ],
      paths: "src/paths",
    }),
  ]);

  /* c8 ignore next 2 */
  if (process.env.DEMO && process.env.DEMO === "true") await loadDemoData();
  return app;
}
