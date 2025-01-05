import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import Course from "../src/models/course.js";
import { app, token } from "./hooks.js";

import { makeMessage } from "../src/services/errorCodes.js";

describe("Courses", function () {
  it("return all courses", function (done) {
    request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.be.an("array");
        done(err);
      });
  });

  it("add a courses", function (done) {
    request(app)
      .post("/api/course")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Philosophy",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property(
          "name",
          "Philosophy"
        );
        done(err);
      });
  });

  it("fail: create Course", function (done) {
    request(app)
      .post("/api/course")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "t",
      })
      .expect(400)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 2000);
        done(err);
      });
  });

  it("fail: missing name create course", function (done) {
    request(app)
      .post("/api/course")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "",
      })
      .expect(400)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 2009);
        done(err);
      });
  });

  it("fail to delete a course", function (done) {
    request(app)
      .delete("/api/course/MATHISGREAT101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({})
      .expect(400)
      .end(function (err) {
        done(err);
      });
  });

  it("delete a course", function (done) {
    request(app)
      .delete("/api/course/SPORTSISGREAT101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({})
      .expect(200)
      .end(function (err) {
        done(err);
      });
  });

  it("succ:update a coursename", function (done) {
    request(app)
      .patch("/api/course/ITISGREATE101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Deutschunterricht",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property(
          "name",
          "Deutschunterricht"
        );
        done(err);
      });
  });

  it("succ:read course info", function (done) {
    request(app)
      .get("/api/course/ITISGREATE101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(
          "name",
          "code",
          "members",
          "owner",
          "scripts"
        );
        done(err);
      });
  });

  it("fail:read course info, not a member", function (done) {
    request(app)
      .get("/api/course/SCIENCEISGREATE101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(400)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 2001);
        done(err);
      });
  });

  it("succ: add course member", function (done) {
    request(app)
      .post("/api/course/MUSICISGREAT101/member")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({})
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(
          "name",
          "code",
          "members",
          "owner",
          "scripts"
        );

        done(err);
      });
  });

  it("succ: add member, user already member", function (done) {
    request(app)
      .post("/api/course/ITISGREATE101/member")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({})
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(
          "name",
          "code",
          "members",
          "owner",
          "scripts"
        );
        done(err);
      });
  });

  it("fail: add member, cannot find course", function (done) {
    request(app)
      .post("/api/course/SCIENCEEATE101/member")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({})
      .expect(400)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.property("code", 2001);
        done(err);
      });
  });

  it("succ: leave course ", function (done) {
    request(app)
      .delete("/api/course/EXITISGREAT101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.deep.equal({ result: "OK" });
        done(err);
      });
  });

  it("succ: change course owner", function (done) {
    request(app)
      .patch("/api/course/CHANGEISGREAT101/owner")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ user: "670538fcc348c69519024e7c" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.include.all.keys(
          Course.fullInfo
        );
        done(err);
      });
  });

  it("fail: change course owner -> course could not be found (not owner / user not a member)", function (done) {
    request(app)
      .patch("/api/course/CHANGEISGREAT101/owner")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ user: "670238fcc348c69519024e7c" })
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.to.have.property(
          "code",
          2007
        );
        done(err);
      });
  });
});
