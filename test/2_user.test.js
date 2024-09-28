import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app } from "./hooks.js";

describe("User", function () {
  it("log a user in", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ login: "john" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys("token", "expiresInSeconds", "timestamp");
        done(err);
      });
  });

  it("fail user login", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ name: "lol" })
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 1002);
        done(err);
      });
  });

  it("register a user", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Peter Pan",
        login: "peter",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.property("name", "Peter Pan");
        done(err);
      });
  });
});
