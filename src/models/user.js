import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { modelOpts } from "../options.js";

export const UserModel = mongoose.model("User", {
  name: {
    type: String,
    description: "Name that is shown in the Client and to other users.",
    required: true,
  },
  login: {
    type: String,
    description: "String that is the password to the application.",
    required: true,
  },
});

export const UserSchema = m2s(UserModel, modelOpts);
