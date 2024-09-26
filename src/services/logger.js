import winston from "winston";

export default winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: "./logging/yalp_error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logging/yalp.log" }),
    new winston.transports.Console({ level: "error" }),
  ],
});
