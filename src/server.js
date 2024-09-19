import express from "express";
import mongoose from "mongoose";
import openapi from "express-openapi";
import apiDoc from "./api-doc.js";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { verifyToken } from "./services/authMiddleware.js";
import "dotenv/config";
import loadDemoData from "./services/demoData.js";

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
      onComplete: function () {
        fetch("http://localhost:3001/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: "john",
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            ui.preauthorizeApiKey("bearerAuth", res.token);
          });
      },
    },
  })
);

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
      errorMiddleware: function (err, req, res, next) {
        console.error(err);
        res.status(err.status || 500);

        if (typeof err === "string") {
          res.send(err);
        } else {
          res.json(err);
        }
      },
      pathSecurity: [[/^\/course/, [{ bearerAuth: [] }]]],
      paths: "src/paths",
    }),
  ]);

  if (process.env.DEMO && process.env.DEMO === "true") await loadDemoData();
  console.log("Backend Running.");
  return app;
}
