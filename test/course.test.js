import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import loading from "../src/server.js";

let app;
let token;
let exampleCourse;

before(async function () {
  app = await loading();
  const response = await request(app).post("/user/login").send({
    login: "john",
  });
  if (response.statusCode !== 200) {
    throw new Error(response.body.message);
  }
  token = response.body.token;
});

it("should return all courses", function (done) {
  request(app)
    .get("/courses")
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

it("should add a courses", function (done) {
  request(app)
    .post("/course")
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

it("should remove a course", async function (done) {
  request(app)
    .delete("/course/" + response.body.code)
    .set("Authorization", `Bearer ${token}`)
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send({})
    .then(function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
});
