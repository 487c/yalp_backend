import jwt from "jsonwebtoken";
import multer from "multer";
import swaggerUi from "swagger-ui-express";
import logger from "./logger.js";
import ErrorCodes, { CodeError } from "./errorCodes.js";

export function generateAccessToken(id) {
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET, {
    expiresIn: Number(process.env.TOKEN_DURATION_SECONDS),
  });
}

export function verifyToken(req) {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || null;

  return new Promise(function (resolve, reject) {
    if (token == null) reject(ErrorCodes(100));
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) reject(ErrorCodes(200, err));

      req.userId = user.id;
      resolve(true);
    });
  });
}

export function handleError(err, req, res, next) {
  let error =
    err instanceof CodeError ? err : ErrorCodes(0, err._message || err.message);
  
  logger.error(error.getMessage(req));
  res.status(error.status).json(error);

  next();
}

export function logInfo(req, res, next) {
  let send = res.send;
  let status = res.status;

  let tmpStatus;
  res.status = (s) => {
    tmpStatus = s;
    res.status = status;
    return res.status(s);
  };
  res.send = (c) => {
    logger.info(
      `${new Date().toUTCString()} - ${req.originalUrl} + ${
        typeof req.body === "object" ? JSON.stringify(req.body) : req.body || ""
      } = status: ${tmpStatus}, response: ${c}`
    );
    res.send = send;
    return res.send(c);
  };
  next();
}

/* c8 ignore next 19*/
export const consumesMiddleware = {
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
};

export const swaggerUiParams = [
  "/api/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: `${process.env.BACKEND_URL}/api-docs`,
      //Automatisches Eintragen des Token in die Authorisierung, wenn man den login erfolgreich aufruft

      responseInterceptor: function (res) {
        /* c8 ignore next 3*/
        if (/login$/.test(res.url) && res.status === 200)
          // eslint-disable-next-line no-undef
          ui.preauthorizeApiKey("bearerAuth", res.obj.token);
      },
    },
  }),
];
