import express from "express";
import mongoose from "mongoose";
import openapi from "express-openapi";
import apiDoc from "./api-doc.js";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { verifyToken } from "./services/authMiddleware.js";
import "dotenv/config";
import loadDemoData from "./services/demoData.js";
import winston from "winston";
import multer from "multer";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "incoming_request", date: new Date() },
  transports: [
    new winston.transports.File({
      filename: "./logging/yalp_error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logging/yalp.log" }),
    new winston.transports.Console({ level: "error" }),
  ],
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  let send = res.send;
  res.send = (c) => {
    logger.info(
      `${req.originalUrl}: ${req.method} params: ${JSON.stringify(
        req.params
      )} body: ${JSON.stringify(req.body || {})} response: ${c} `
    );
    res.send = send;
    return res.send(c);
  };
  next();
});
app.use(
  "/api/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: `${process.env.BACKEND_URL}/api-docs`,
      //Automatisches Eintragen des Token in die Authorisierung, wenn man den login erfolgreich aufruft
      responseInterceptor: function (res) {
        if (/login$/.test(res.url) && res.status === 200)
          ui.preauthorizeApiKey("bearerAuth", res.obj.token);
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
        res.status(err.status || 500);
        logger.error(
          `${req.originalUrl} / body: ${JSON.stringify(req.body)}: ${
            err.status || 500
          } ${err.message}`
        );
        if (typeof err === "string") {
          res.send(err);
        } else {
          res.json(err);
        }
      },
      consumesMiddleware: {
        "multipart/form-data": function (req, res, next) {
          multer().any()(req, res, function (err) {
            if (err) return next(err);
            const filesMap = req.files.reduce(
              (acc, f) =>
                Object.assign(acc, {
                  [f.fieldname]: (acc[f.fieldname] || []).concat(f),
                }),
              {}
            );
            Object.keys(filesMap).forEach((fieldname) => {
              const files = filesMap[fieldname];
              req.body[fieldname] = files.length > 1 ? files.map(() => "") : "";
            });
            return next();
          });
        },
      },
      pathSecurity: [
        [/^\/course/, [{ bearerAuth: [] }]],
        [/^\/script/, [{ bearerAuth: [] }]],
      ],
      paths: "src/paths",
    }),
  ]);

  if (process.env.DEMO && process.env.DEMO === "true") await loadDemoData();
  console.log("Backend Running.");
  return app;
}
