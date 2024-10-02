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

  /**
   * TODO: Implementation test for failing file upload
   */
  it("fail: create script, missing file", function (done) {
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

  it("fail: create script, name too short", function (done) {
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

  it("fail: get script, not member of course", function (done) {
    request(app)
      .get(`/api/script/a4022ea6-a6b0-42f4-b7fe-e0c7a04a7320`)
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
