import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { modelOpts } from "../options.js";

export const user = mongoose.model("User", {
  name: {
    type: String,
    description: "Anzeigename des Benutzers",
    required: true,
  },
  mail: {
    type: String,
    description: "E-mail adresse des Users.",
    required: true,
  },
});

export const UserSchema = m2s(user, modelOpts);
