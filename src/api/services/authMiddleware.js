import jwt from "jsonwebtoken";

export function generateAccessToken(id) {
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET, {
    expiresIn: Number(process.env.TOKEN_DURATION_SECONDS),
  });
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    throw {
      status: 401,
      message: "User authentification via token.",
    };

  return new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err)
        throw {
          status: 403,
          message: "User Token invalid",
        };

      req.userId = user.id;
      resolve(true);
    });
  });
}
