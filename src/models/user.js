import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { generateAccessToken } from "../services/authMiddleware.js";

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
    },
    login: {
      type: String,
      description: "String that is the password to the application.",
      required: true,
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
    if (await this.model.findOne({ login: login }))
      throw {
        code: 1000,
        message: "That login is already taken... (whatever that implies)",
      };

    if (await this.model.findOne({ name: name }))
      throw {
        code: 1001,
        message: "That name is already taken.",
      };

    const newUser = await this.model.create({
      name,
      login,
    });

    const obj = await newUser.toObject();
    return { name: obj.name };
  },

  async login(login) {
    if (!login)
      throw {
        code: 1002,
        message: "Missing login",
      };
    const user = await this.model.findOne({
      login,
    });

    if (!user) throw { code: 1003, message: "User not found" };

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
