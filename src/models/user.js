import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import ErrorCodes from "../services/errorCodes.js";
import { generateAccessToken } from "../services/middlewares.js";

/**
 * TODO: Validierung für Usereigenschaften hinzufügen
 * Länge und Eigenschaften des Loginnamens? Vielleicht brauchen wir da auch sonderzeichen oder ähnliches
 * Weil wir der Login ja auch das Psswort ist...
 */
export default {
  model: mongoose.model("User", {
    name: {
      type: String,
      description: "Name that is shown in the Client and to other users.",
      required: true,
      unique: true,
    },
    login: {
      type: String,
      description: "String that is the password to the application.",
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return v.length > 10;
        },
        message: () => `The login must be at least 10 signs long!`,
      },
    },
    settings: {
      type: Object,
      description: "Settings for the user",
    },
    lastOpenedCourse: {
      type: String,
      description: "Code of the last opened course",
    },
  }),

  register: async function ({ name, login }) {
    let newUser;
    try {
      newUser = await this.model.create({
        name,
        login,
      });
    } catch (e) {
      throw ErrorCodes(1001, e);
    }

    const obj = await newUser.toObject();
    return { name: obj.name };
  },

  async login(login) {
    if (!login) throw ErrorCodes(1000, "No login provided");
    const user = await this.model.findOne({
      login,
    });

    if (!user) throw ErrorCodes(1003);

    return {
      token: generateAccessToken(user._id),
      expiresInSeconds: process.env.TOKEN_DURATION_SECONDS,
      timestamp: new Date().valueOf(),
    };
  },

  getReducedSchema() {
    return m2s(this.model, {
      props: ["name"],
      omitFields: ["_id"],
    });
  },
};
