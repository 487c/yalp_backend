import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { modelOpts } from "../options.js";

export const script = mongoose.model("Script", {
  name: {
    type: String,
    description: "Anzeigename des Dokumentes in der Applikation",
    required: true,
  },
  fileName: {
    type: String,
    description: "Dateiname des Skriptes",
    required: true,
  },
  cards: {
    type: [String],
    description: 'Kartenids zu einem Skript',
    required: true,
  }
});

export const ScriptSchema = m2s(script, modelOpts);
