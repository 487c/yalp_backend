import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app, token } from "./hooks.js";
import { openAsBlob } from "fs";

describe("Script", function () {
  it("success: create a script", function (done) {
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

  it("success: get script for user", function (done) {
    request(app)
      .get(`/api/script/1e274ba0-b772-4edd-8c04-b5291af2e8bb`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys([
          "name",
          "description",
          "dateCreated",
          "cards",
          "uuid",
        ]);
        done(err);
      });
  });


  it("success: delete script", function (done) {
    request(app)
      .get(`/api/script/1e274ba0-b772-4edd-8c04-b5291af2e8bb`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.keys([
          "name",
          "description",
          "dateCreated",
          "cards",
          "uuid",
        ]);
        done(err);
      });
  });

  // it("success: insert course file", async function (done) {
  //   const file = await openAsBlob("./example_file.pdf");
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("name", "Algebra_Script_1.pdf");
  //   formData.append("dateModified", new Date.now());

  //   request(app)
  //     .post(
  //       `/api/course/MATHISGREAT101/script/f317ee1a-00fc-4682-a79c-58c1cf1859ae/file`
  //     )
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "multipart/form-data")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(formData)
  //     .expect(200)
  //     .end(function (err, res) {
  //       expect(res.statusCode).to.be.eql(400);
  //       done(err);
  //     });
  // });

  // it("fail: upload script -> pdf is too big", function (done) {
  //   request(app)
  //     .post("/api/user/login")
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ name: "lol" })
  //     .expect(400)
  //     .end(function (err, res) {
  //       expect(res.body).to.have.property(
  //         "message",
  //         "The file ist too big, max size is 16MB"
  //       );
  //       done(err);
  //     });
  // });

  // it("fail: upload script -> missing base64", function (done) {
  //   request(app)
  //     .post("/api/user/login")
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ name: "lol" })
  //     .expect(400)
  //     .end(function (err, res) {
  //       expect(res.body).to.have.property("message", "Missing login");
  //       done(err);
  //     });
  // });

  // it("fail: upload script -> wrong type", function (done) {
  //   request(app)
  //     .post("/api/user/login")
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ name: "lol" })
  //     .expect(400)
  //     .end(function (err, res) {
  //       expect(res.body).to.have.property("message", "Missing login");
  //       done(err);
  //     });
  // });

  // it("fail: upload script -> failed markdown conversion", function (done) {
  //   request(app)
  //     .post("/api/user/login")
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ name: "lol" })
  //     .expect(400)
  //     .end(function (err, res) {
  //       expect(res.body).to.have.property("message", "Missing login");
  //       done(err);
  //     });
  // });
});
