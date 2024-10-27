import "dotenv/config";
// import request from "supertest";
// import { expect } from "chai";
// import { app, token } from "./hooks.js";
// import Card from "../src/models/card.js";

// import { makeMessage } from "../src/services/errorCodes.js";

describe("Deck", function () {
  it("succ: GET Deck")
  it("succ: GET Deck, Anki Format")

  // it("succ: POST a card", function (done) {
  //   request(app)
  //     .post(`/api/script/66fdc364ec1a0050d720b667/card`)
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       front: "Was sind binomsiche Formel?",
  //       back: "Woher soll ich das wissen?",
  //       anchor: {
  //         scriptId: "66fdc364ec1a0050d720b667",
  //         context: [0],
  //       },
  //     })
  //     .end(function (err, res) {
  //       expect(res.body, makeMessage(res.body)).to.have.keys(Card.fullInfo);
  //       done(err);
  //     });
  // });

  // it("fail: POST a card -> invalid input", function (done) {
  //   request(app)
  //     .post(`/api/script/66fdc364ec1a0050d720b667/card`)
  //     .set("Accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       back: "Woher soll ich das wissen?",
  //     })
  //     .end(function (err, res) {
  //       expect(res.body, makeMessage(res.body)).to.have.property("code", 4000);
  //       done(err);
  //     });
  // });
});
