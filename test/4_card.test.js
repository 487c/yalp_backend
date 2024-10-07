import request from "supertest";
import { expect } from "chai";
import "dotenv/config";
import { app, token } from "./hooks.js";
import Card from "../src/models/card.js";

describe("Cards", function () {
  it("succ: POST a card", function (done) {
    request(app)
      .post(`/api/script/66fdc364ec1a0050d720b667/card`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        front: "Was sind binomsiche Formel?",
        back: "Woher soll ich das wissen?",
        anchor: {
          scriptId: "66fdc364ec1a0050d720b667",
          context: [1],
        },
      })
      .end(function (err, res) {
        expect(res.body).to.have.keys(Card.fullInfo);
        done(err);
      });
  });

  it("fail: POST a card -> invalid input", function (done) {
    request(app)
      .post(`/api/script/66fdc364ec1a0050d720b667/card`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        back: "Woher soll ich das wissen?",
      })
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 4000);
        done(err);
      });
  });

  it("succ: GET a card", function (done) {
    request(app)
      .get(`/api/card/62fef46e9af90a018fd01094`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .end(function (err, res) {
        expect(res.body).to.have.all.keys(Card.fullInfo);
        done(err);
      });
  });

  it("fail: GET a card -> card not found (invalid guid)", function (done) {
    request(app)
      .get(`/api/card/11fdc364ec1a0050d720c667`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 4001);
        done(err);
      });
  });

  /**
   * TODO(@svolume): Checken auf Kartenzugriffsberechtigungen?
   *  Sollte man prüfen ob ein User Berechtigung hat auf die Karte zuzugreifen (muss im gleichen Kurs sein).
   */
  it("fail: GET a card -> card not found", function (done) {
    request(app)
      .get(`/api/card/11fdc364ec1a0050d720c667`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .end(function (err, res) {
        expect(res.body).to.have.property("code", 4001);
        done(err);
      });
  });

  it("succ: UPDATE a card");
  it("fail: UPDATE a card, card not found");
  it("fail: UPDATE a card, invalid values");

  it("succ: DELETE a card");
  it("fail: DELETE a card, card not found");
});
