import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { randomUUID } from "crypto";

export default {
  model: mongoose.model("Card", {
    uuid: {
      type: mongoose.Schema.Types.UUID,
      description: "UUID des Skriptes",
      required: true,
      default: () => randomUUID(),
    },
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
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   description: "Id des Authors einer Karte",
    //   required: true,
    // },
  }),
  getReducedSchema() {
    return m2s(this.model, {
      props: ["front", "back"],
      omitFields: ["_id", "uuid", "author"],
    });
  },
};
