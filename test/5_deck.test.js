import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import { app, token } from "./hooks.js";
import Deck from "../src/models/deck.js";

import { makeMessage } from "../src/services/errorCodes.js";

describe("Deck", function () {
  it("succ: GET Deck, Anki Format");
  it("fail: GET Deck -> unkown id");

  it("succ: GET Deck", function (done) {
    request(app)
      .post(`/api/course/MATHISGREAT101/deck`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .end(function (err, res) {
        expect(res.body, makeMessage(res.body)).to.have.keys(Deck.fullInfo);
        done(err);
      });
  });
});
