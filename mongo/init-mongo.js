db = db.getSiblingDB(process.env.MONGO_DB_NAME);

db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_USER_PW,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_DB_NAME,
    },
  ],
});
