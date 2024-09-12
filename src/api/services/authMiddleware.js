import jwt from "jsonwebtoken";

export function generateAccessToken(username) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET, {
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

  new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) reject(err);

      req.user = user;
      resolve(true);
    });
  });
}
