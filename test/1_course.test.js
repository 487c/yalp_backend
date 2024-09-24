import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app, token } from "./hooks.js";

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
        expect(res.body).to.be.an("array");
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
        expect(res.body).to.have.property("name", "Philosophy");
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
      .end(function (err, res) {
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
      .end(function (err, res) {
        done(err);
      });
  });

  it("update a coursename", function (done) {
    request(app)
      .patch("/api/course/DEUTSCHISGREAT101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        name: "Deutschunterricht",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.property("name", "Deutschunterricht");
        done(err);
      });
  });

  it("read course info", function (done) {
    request(app)
      .get("/api/course/DEUTSCHISGREAT101")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys(
          "name",
          "code",
          "members",
          "owner",
          "scripts"
        );
        done(err);
      });
  });

  it("add course member", function (done) {
    request(app)
      .post("/api/course/SCIENCEISGREATE101/member")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({})
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys(
          "name",
          "code",
          "members",
          "owner",
          "scripts"
        );

        done(err);
      });
  });

  it("remove course member", function (done) {
    request(app)
      .delete("/api/course/FRENCHISGREAT101/member")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.deep.equal({ result: "OK" });
        done(err);
      });
  });

  it("change course owner", function (done) {
    request(app)
      .patch("/api/course/MUSICISGREAT101/owner")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ user: "jane" })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.deep.equal({ result: "OK" });
        done(err);
      });
  });
});
