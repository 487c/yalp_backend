import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app, token } from "./hooks.js";
import fs from "fs";
import Script from "../src/models/script.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Script", function () {
  it("succ: create a script", function (done) {
    fs.readFile(__dirname + "/example_file.pdf", function (err, data) {
      fs.stat(__dirname + "/example_file.pdf", function (err, stat) {
        request(app)
          .post(`/api/course/MATHISGREAT101/script`)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Timetravel",
            description: "The long island icetea of science fiction.",
            fileName: "example_file.pdf",
            file: data.toString("base64"),
            fileDateModified: stat.mtime,
          })
          .end(function (err, res) {
            expect(res.body).to.have.keys(Script.fullInfo);
            done(err);
          });
      });
    });
  });

  it("fail: create script -> course not found", function (done) {
    fs.readFile(__dirname + "/example_file.pdf", function (err, data) {
      fs.stat(__dirname + "/example_file.pdf", function (err, stat) {
        request(app)
          .post(`/api/course/MATHISGREAT102/script`)
          .set("Accept", "application/json")
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Timetravel",
            description: "The long island icetea of science fiction.",
            fileName: "example_file.pdf",
            file: data.toString("base64"),
            fileDateModified: stat.mtime,
          })
          .end(function (err, res) {
            expect(res.body).to.have.property("code", 3001);
            done(err);
          });
      });
    });
  });

  it("fail: create script -> name taken", function (done) {
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

  it("fail: create script -> invalid values", function (done) {
    request(app)
      .post(`/api/course/MATHISGREAT101/script`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "alg", description: "Algebra is the best" })
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 3003);
        done(err);
      });
  });

  it("succ: get script", function (done) {
    request(app)
      .get(`/api/script/66fdc364ec1a0050d720b667`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys(Script.fullInfo);
        done(err);
      });
  });

  it("fail: get script, broken", function (done) {
    request(app)
      .get(`/api/script/1e274ba0-b772-4edd-8c04-b5291af2e8bc`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 3007);
        done(err);
      });
  });

  it("fail: get script, id not existing", function (done) {
    request(app)
      .get(`/api/script/66fdc364ec1a0051d720b667`)
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

  it("fail: get script, not member of course", function (done) {
    request(app)
      .get(`/api/script/17fdc364ec1a0050d720b667`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400)
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 3004);
        done(err);
      });
  });
});
