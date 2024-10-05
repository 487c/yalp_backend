import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import ErrorCodes from "../services/errorCodes.js";
import { generateAccessToken } from "../services/middlewares.js";
import { shortenSchema } from "../services/utils.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export default {
  fullInfo: ["name", "settings", "lastOpenedCourse", "id"],
  reducedInfo: ["name"],

  model: mongoose.model(
    "User",
    new mongoose.Schema(
      {
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
              return /^[a-zA-Z0-9]{10,}$/.test(v);
            },
            message: () => `Der Login muss 10 Zeichen lang sein und \n
        und darf nur aus Buchstaben und Zahlen bestehen.`,
          },
        },
        settings: {
          //TODO: Implement save settings path
          showLastOpenedCourse: {
            type: Boolean,
            description: "Show the last opened course on the startpage",
            default: true,
          },
        },
        lastOpenedCourse: {
          type: String,
          description: "Code of the last opened course",
          default: null,
        },
      },
      {
        virtuals: {
          id: {
            get: function () {
              return this._id;
            },
          },
        },
        toJSON: {
          transform: function (user, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.login;
          },
        },
      }
    ).plugin(mongooseLeanVirtuals)
  ),

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

  /**
   * Returns the token and user information
   * @param {String} login password
   * @returns {Object}
   */
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
      profile: user.toJSON(),
    };
  },

  /**
   * Liefert das User Profil für den User
   * @param {String} userId
   * @returns
   */
  async get(userId) {
    const user = await this.model
      .findOne({ _id: userId }, "-__v")
      .lean({ virtuals: ["id"] });
    delete user._id;
    delete user.login;
    return user;
  },

  getApiSchema(title, type) {
    return shortenSchema(m2s(this.model), title, this[type]);
  },
};
