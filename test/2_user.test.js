import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app } from "./hooks.js";
import user from "../src/models/user.js";
import { token } from "./hooks.js";

import { makeMessage } from "../src/services/errorCodes.js";

describe("User", function () {
  it("succ: POST user login", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ mail: "john@doemail.com", password: "password" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(
          "token",
          "expiresInSeconds",
          "timestamp",
          "profile"
        );
        expect(res.body.profile).to.have.keys(user.fullInfo);
        done(err);
      });
  });

  it("fail: POST user login -> user not existing", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ mail: "mike@mikemail.com", password: "password" })
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 1002);
        done(err);
      });
  });

  it("fail: POST user login -> password wrong", function (done) {
    request(app)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ mail: "john@doemail.com", password: "pord" })
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 1002);
        done(err);
      });
  });

  it("succ: POST user register", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Peter Pan",
        mail: "peterpan@mail.de",
        password: "password",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(user.fullInfo);
        done(err);
      });
  });

  it("fail: POST user register, -> invalid values(password)", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Peter Pan",
        mail: "peter@mail.de",
        password: "",
      })
      .expect(400)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 1001);
        done(err);
      });
  });

  it("fail: POST user register, -> invalid values(mail)", function (done) {
    request(app)
      .post("/api/user/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Peter Pan",
        mail: "peter@",
        password: "password",
      })
      .expect(400)
      .end(function (err, res) {

        expect(res.body, makeMessage(res.body)).to.have.property("code", 1001);
        done(err);
      });
  });

  it("succ: GET user profile", function (done) {
    request(app)
      .get("/api/user")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(user.fullInfo);
        done(err);
      });
  });

  it("succ: PATCH user profile", function (done) {
    request(app)
      .patch("/api/user")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "John Doe The Dirt" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(user.fullInfo);
        done(err);
      });
  });

  it("fail: PATCH user profile -> invalid values", function (done) {
    request(app)
      .patch("/api/user")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "te" })
      .expect(400)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 1004);
        done(err);
      });
  });

it("succ: GET user info (other user0", function (done) {
    request(app)
      .get("/api/user/670538fcc348c69519024e7c")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(
          "id",
          "name"
        );
        done(err);
      });
  });
});
