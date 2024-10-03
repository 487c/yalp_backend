import logger from "./logger.js";

// TODO(@svolume): Code pro Pfad für die swagger_ui?
//  Ich denke du wirst die Fehlermeldungen ja gesammelt behandeln.
const codes = {
  0: "Unknown Error",
  100: "Token missing",
  200: "Token invalid",
  1000: "Missing parameter",
  1001: "User could not be created",
  1002: "Login is missing",
  1003: "User could not be found",
  2000: "Course could not be created",
  2001: "Could not find course or user is not a member of the course",
  2002: "Could not find course / you are not the owner of the course",
  2003: "You are not the sole member of the course",
  2004: "You are already member of the course",
  2005: "You are not owner of course (delete Course/change Owner)",
  2006: "You is something wrong, the course has no members",
  2007: "The given name does not correspond to a user",
  2008: "New owner is current course owner",
  2009: "Missing course name.",
  2010: "Error updating course",
  3001: "Sript could not be found",
  3002: "Sript name is already taken",
  3003: "Could not create Script ( + Error)",
  3004: "Not a member of the course",
  3005: "The Script is missing a file (not yet fully created)",
  3006: "Missing id for script",
  3007: "Error searching for script"
};

const status = {
  0: 500,
  100: 401,
  200: 403,
};

/**
 * Returns a message based on the error code
 * @param {Number} code of the error code
 * @param {String} [error] of the error code
 */
export default function (code = 0, error) {
  return new CodeError(
    code,
    status[code] || 400,
    codes[code] + ((error && " : " + error) || "")
  );
}

export class CodeError {
  constructor(code, status, message) {
    this.message = message;
    this.code = code;
    this.status = status;
  }

  log(req) {
    const msg = `${new Date().toUTCString()} - ${req.originalUrl} + ${
      typeof req.body === "object" ? JSON.stringify(req.body) : req.body || ""
    } = status: ${this.status || 500}, code: ${this.code}, message: ${
      this.message
    }`;

    console.error(msg);
    logger.error(msg);
  }
}
