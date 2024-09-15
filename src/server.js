import express from "express";
import mongoose from "mongoose";
import { initialize } from "express-openapi";
import apiDoc from "./api/api-doc.js";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { verifyToken } from "./api/services/authMiddleware.js";
import "dotenv/config";

console.log(
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
      url: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/api-docs`,
      //Automatisches Eintragen des Token in die Authorisierung, wenn man den login erfolgreich aufruft
      responseInterceptor: function (res) {
        if (/login$/.test(res.url) && res.status === 200)
          ui.preauthorizeApiKey("bearerAuth", res.obj.token);
      },
    },
  })
);

/* Laden des OpenApi Geräts */
await initialize({
  app,
  apiDoc: apiDoc,
  dependencies: {},
  securityHandlers: {
    bearerAuth: verifyToken,
  },
  errorMiddleware: function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);

    if (typeof err === "string") {
      res.send(err);
    } else {
      res.json(err);
    }
  },
  pathSecurity: [
    // [/^\/course/, [{ bearerAuth: [] }]],
  ],
  paths: "src/api/paths",
});

app.listen(process.env.BACKEND_PORT);

console.log("Backend Running.");
