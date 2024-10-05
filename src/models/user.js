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
          validate: {
            validator: function (v) {
              return v.length > 2;
            },
            message: () => `Der name muss länger als 2 Zeichen sein..`,
          },
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
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.login;
          },
        },
      }
    ).plugin(mongooseLeanVirtuals)
  ),

  /**
   * Creates a user
   * @param {Object} param0
   * @param {String} param0.name
   * @param {String} param0.login
   * @returns {User}
   */
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

    return this.get(newUser._id);
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

  async update(userId, data) {
    const user = await this.model.findOne({ _id: userId });
    user.set(data);
    let result;
    try {
      result = await user.save();
      return result.toJSON();
    } catch (e) {
      throw ErrorCodes(1004, e);
    }
  },

  getApiSchema(title, type) {
    return shortenSchema(m2s(this.model), title, this[type]);
  },
};
