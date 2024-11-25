import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import ErrorCode from "../services/errorCodes.js";
import { shortenSchema } from "../services/utils.js";

export default {
  fullInfo: ["script", "cards"],
  model: mongoose.model(
    "Deck",
    mongoose.Schema(
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          description: "Kurs UUID zu dem das Skript gehört",
          required: true,
          immutable: true,
        },
        cards: {
          type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
          description: "Kartenids zu dem Deck",
          default: [],
          required: true,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          immutable: true,
          required: true,
        },
      },
      {
        toJSON: {
          transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
          },
        },
      }
    )
  ),

  /**
   * Creates a new Script
   * @param {String} courseId
   * @param {String} userId
   * @returns
   */
  async create(courseId, userId) {
    await this.model.create({
      owner: userId,
      cards: [],
      course: courseId,
    });
  },

  /**
   * Deletes the Script if:
   * 1. It has no cards
   * @param {String} id
   * @param {String} userId
   */
  async delete(id, userId) {
    return await this.model.deleteOne({ id, owner: userId });
  },

  /**
   * Returns the script with the id and the userId that must be member
   * @param {String} id of the script
   * @param {String} userId userId
   * @param {Object} populate
   * @param {boolean} card
   * @returns {Object}
   */
  async get(id, userId, format = "full") {
    if (!id) throw ErrorCode(3006);
    let deck;
    try {
      const promise = this.model
        .findOne({ _id: id, owner: userId }, { __v: 0 })
        .populate("cards")
        .lean();

      deck = await promise;
    } catch (e) {
      throw ErrorCode(3007, e);
    }

    return deck;
  },

  getApiSchema(title, type) {
    return shortenSchema(m2s(this.model), title, this[type]);
  },
};
