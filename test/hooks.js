import request from "supertest";
import "dotenv/config";
import loading from "../src/server.js";

export let app;
export let token;

export const mochaHooks = async () => {
  app = await loading();
  const response = await request(app).post("/api/user/login").send({
    login: "john",
  });
  if (response.statusCode !== 200) {
    // throw new Error(response.body.message);
  }
  token = response.body.token;
  return {
    beforeAll(done) {
      done();
    },
  };
};
