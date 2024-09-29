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
      .send({ login: "johnwhoRidesDoes" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys("token", "expiresInSeconds", "timestamp");
        done(err);
      });
  });

  it("fail: user login, missing login", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ name: "lol" })
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 1000);
        done(err);
      });
  });

  it("fail: user login, login not existing", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ login: "Jason" })
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 1003);
        done(err);
      });
  });

  it("succ: user register", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Peter Pan",
        login: "name already taken",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.property("name", "Peter Pan");
        done(err);
      });
  });

  it("fail: user register, create", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Peter Pan",
        login: "peter",
      })
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 1001);
        done(err);
      });
  });
});
