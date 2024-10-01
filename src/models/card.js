import mongoose from "mongoose";

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
    // author: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   description: "Id des Authors einer Karte",
    //   required: true,
    // },
  }),
};
