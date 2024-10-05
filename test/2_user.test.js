import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app } from "./hooks.js";
import user from "../src/models/user.js";
import { token } from "./hooks.js";

describe("User", function () {
  it("succ: user login", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ login: "johnwhoRidesDoes" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys("token", "expiresInSeconds", "timestamp", 'profile');
        expect(res.body.profile).to.have.keys(user.fullInfo);
        done(err);
      });
  });

  it("fail: user register, login too short", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ login: "lol", name: "Name ist zu kurz." })
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 1001);
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
        login: "namealreadytaken",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.property("name", "Peter Pan");
        done(err);
      });
  });

  it("fail: POST register -> invalid values");
  it("succ: GET user profile", function (done) {
    request(app)
      .get("/api/user")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys(user.fullInfo);
        done(err);
      });
  });
  it("fail: GET user profile -> user not found");
});
