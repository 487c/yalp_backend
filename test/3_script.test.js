import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app, token } from "./hooks.js";

describe("Script", function () {
  it("success: prepare a script", function (done) {
    request(app)
      .post(`/api/course/MATHISGREAT101/script`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Timetravel",
        description: "The long island icetea of science fiction.",
      })
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys(["uuid"]);
        done(err);
      });
  });

  it("fail: get script, missing code", function (done) {
    request(app)
      .post(`/api/course/MATHISGREAT101/script`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Algebra", description: "Algebra is the best" })
      .expect(400)
      .end(function (err, res) {
        expect(res.statusCode).to.be.eql(400);
        done(err);
      });
  });

  it("fail: create a script, taken name", function (done) {
    request(app)
      .post(`/api/course/MATHISGREAT101/script`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Algebra", description: "Algebra is the best" })
      .expect(400)
      .end(function (err, res) {
        expect(res.statusCode).to.be.eql(400);
        done(err);
      });
  });

  it("fail: get script for user(missing file)", function (done) {
    request(app)
      .get(`/api/script/1e274ba0-b772-4edd-8c04-b5291af2e8bb`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 3005);
        done(err);
      });
  });

  it("fail: get script, missing uuid", function (done) {
    request(app)
      .get(`/api/script/1e274ba0-b772-4edd-8c04-b5291af2e8bc`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 3001);
        done(err);
      });
  });

  it("success: upload a script", function (done) {
    request(app)
      .post(`/api/script/1e274ba0-b772-4edd-8c04-b5291af2e8bb/file`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", "./test/example_file.pdf")
      .field("name", "example_file.pdf")
      .field("modifiedDate", new Date().toISOString())
      .expect(200, done);
  });

  it("fail: create script, name too short", function (done) {
    request(app)
      .post(`/api/course/MATHISGREAT101/script`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "alg", description: "Algebra is the best" })
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property('code', 3003);
        done(err);
      });
  });

  it("fail: get script, not member of course", function (done) {
    request(app)
      .get(`/api/script/a4022ea6-a6b0-42f4-b7fe-e0c7a04a7320`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property('code', 3004);
        done(err);
      });
  });

});
