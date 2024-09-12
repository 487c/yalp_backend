import jwt from "jsonwebtoken";

export function generateAccessToken(username) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET, {
    expiresIn: Number(process.env.TOKEN_DURATION_SECONDS),
  });
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}
