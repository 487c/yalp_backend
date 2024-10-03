import mongoose from "mongoose";
import Script from "./script.js";
import ErrorCodes from "../services/errorCodes.js";

export default {
  model: mongoose.model("Card", {
    front: {
      type: String,
      description: "Frage oder Vorderseite einer Lernkarte.",
      required: true,
    },
    back: {
      type: String,
      description: "Antwort oder Rückseite einer Lernkarte",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      description: "Id des Authors einer Karte",
      required: true,
      immutable: true,
    },
    creationDate: {
      type: Date,
      description: "Erstellungszeit der Karte",
      default: Date.now,
      immutable: true,
    },
  }),

  /**
   * Creates an card
   * @param {String} scriptId author
   * @param {String} userId author
   * @param {Object} param1 Card infos
   * @param {String} param1.front
   * @param {String} param1.back
   */
  async create(scriptId, userId, { front, back }) {
    const script = await Script.get(scriptId, userId);
    let card;
    try {
      card = await this.model.create({
        author: userId,
        front,
        back,
      });
    } catch (e) {
      throw ErrorCodes(4000, e);
    }

    script.cards.push(card._id);
    return await script.save();
  },
};
