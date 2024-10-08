import request from "supertest";
import "dotenv/config";
import loading from "../src/server.js";
import logger from "../src/services/logger.js";

export let app;
export let token;

export const mochaHooks = async () => {
  logger.silent = true;
  app = await loading();
  const response = await request(app).post("/api/user/login").send({
    login: "johnwhoRidesDoes",
  });
  if (response.statusCode !== 200) {
    // throw new Error(response.body.message);
  }
  token = response.body.token;
  return {
    beforeAll(done) {
      done();
    },
    afterAll(done) {
      logger.silent = false;
      done();
    },
  };
};
