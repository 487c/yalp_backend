import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import loading from "../src/server.js";

let app;

before(async function () {
  app = await loading();
});

it("should return all products", function (done) {
  request(app)
    .get("/courses")
    .send()
    .expect(200)
    .end(function (err, res) {
      done(err);
    });
});
