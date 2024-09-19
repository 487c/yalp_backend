import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { modelOpts } from "../options.js";

export const Card = mongoose.model("Card", {
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
  },
});

export const CardSchema = m2s(Card, modelOpts);
