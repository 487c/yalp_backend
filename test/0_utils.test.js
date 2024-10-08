import errorCodes, {
  CodeError,
  makeMessage,
} from "../src/services/errorCodes.js";
import { expect } from "chai";
import {
  generateAccessToken,
  verifyToken,
} from "../src/services/middlewares.js";
import user from "../src/models/user.js";

describe("Others", function () {
  it("should error obj without", function (done) {
    const error = errorCodes(0);
    expect(error).to.be.an("object");
    expect(error).to.have.property("code", 0);
    expect(error).to.have.property("message", "Unknown Error");
    done();
  });

  it("should error obj with errormsg", function (done) {
    const error = errorCodes(1000, "failed");
    expect(error).to.be.an("object");
    expect(error).to.have.property("code", 1000);
    expect(error).to.have.property("message", "Missing parameter : failed");
    done();
  });

  it("should error obj without code", function (done) {
    const error = errorCodes();
    expect(error).to.be.an("object");
    expect(error).to.have.property("code", 0);
    expect(error).to.have.property("message", "Unknown Error");
    done();
  });

  it("should throw invalid token", function (done) {
    const token = generateAccessToken(1) + 1;
    verifyToken({ headers: { authorization: `Bearer ${token}` } }, {}).catch(
      (err) => {
        expect(err).to.be.an("object");
        expect(err).to.have.property("code", 200);
        expect(err).to.have.property("status", 403);
        done();
      }
    );
  });

  it("should throw missing token", function (done) {
    verifyToken({ headers: { authorization: `` } }, {}).catch((err) => {
      expect(err).to.be.an("object");
      expect(err).to.have.property("code", 100);
      expect(err).to.have.property("status", 401);

      done();
    });
  });

  it("should parse mongoose to api schema w id", function (done) {
    const api = user.getApiSchema("User", "fullInfo");
    expect(api).to.be.an("object");
    expect(api).to.have.property("title", "User");
    expect(api.properties).to.have.keys(user.fullInfo);
    done();
  });

  it("should parse mongoose to api schema w/o id", function (done) {
    const api = user.getApiSchema("User", "reducedInfo");
    expect(api).to.be.an("object");
    expect(api).to.have.property("title", "User");
    expect(api.properties).to.not.have.key("id");
    done();
  });

  it("should parse error (code, message)", function (done) {
    const api = makeMessage({ code: 1001, message: "test" });
    expect(api).to.be.an("string");
    expect(api).to.match(/1001/);
    done();
  });

  it("should make logstring", function (done) {
    const msg = new CodeError(0, 100, "test").getMessage({
      originalUrl: "https://test",
      body: { test: "test" },
    });
    expect(msg).to.be.an("string");
    expect(msg).to.match(/test/);
    done();
  });

  it("should create an jwt_token", function (done) {
    const token = generateAccessToken("test");
    expect(token);
    done();
  });

  it("token should test invalid", function (done) {
    const token =
      "dslf.eyJpZCI6InRlc3QiLCJpYXQiOjE3Mjg0MTIzOTIsImV4cCI6MTcyODQxNDE5Mn0.c7KTKDt846G7HG3lcLXUYGnKeIz7_ydU5umd_xNOvE0";
     verifyToken({
      headers: { authorization: `bearer ${token}` },
    })
      .then(function () {
      })
      .catch(function (e) {
        expect(e).to.have.property("code", 200);
        done();
      });
  });

  it("token should test missing", function (done) {
     verifyToken({
      headers: {  },
    })
      .then(function () {
      })
      .catch(function (e) {
        expect(e).to.have.property("code", 100);
        done();
      });
  });
});
