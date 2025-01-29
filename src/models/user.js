import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import ErrorCodes from "../services/errorCodes.js";
import { generateAccessToken } from "../services/middlewares.js";
import { shortenSchema } from "../services/utils.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import argon2 from "argon2";
import errorCodes from "../services/errorCodes.js";

export default {
  fullInfo: ["name", "settings", "id", "mail"],
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
        password: {
          type: String,
          description: "Hash des Passworts",
          required: true,
        },
        mail: {
          type: String,
          description: "Mail mit der der User sich einloggen kann.",
          required: true,
          unique: true,
          validate: {
            validator: function (v) {
              return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: () => `Die Mail ist invalide.`,
          },
        },
        settings: {
          showLastOpenedCourse: {
            type: Boolean,
            description: "Show the last opened course on the startpage",
            default: true,
          },
          language: {
            type: String,
            description: "Die Sprache des Clients",
            example: "de",
            validate: [
              (v) => /^[a-z]{2}$/.test(v),
              "Falsches Pattern im Sprachcode -> 'de'",
            ],
            default: () => "de",
          },
          lastOpenedCourse: {
            type: String,
            description: "Code of the last opened course",
            default: null,
          },
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
            delete ret.password;
          },
        },
      }
    ).plugin(mongooseLeanVirtuals)
  ),

  /**
   * Creates a user
   * @param {Object} param0
   * @param {String} param0.name
   * @returns {User}
   */
  register: async function ({ name, password, mail }) {
    let newUser;
    try {
      newUser = await this.model.create({
        name,
        mail,
        password: password ? await argon2.hash(password) : null,
      });
    } catch (e) {
      throw ErrorCodes(1001, e);
    }

    return this.get(newUser._id);
  },

  /**
   * Returns the token and user information
   * @param {String} mail
   * @param {String} password
   * @returns {Object}
   */
  async login(mail, password) {
    const user = await this.model.findOne({
      mail,
    });

    if (!user || !(await argon2.verify(user.password, password)))
      throw errorCodes(1002);

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
    delete user.password;
    return user;
  },

  /**
   * Gets reduced infos on a user
   * @param {String} userId 
   */
  async getReduced(userId){
    const user = await this.model
      .findOne({ _id: userId }, "-__v -password -settings -mail")
      .lean({ virtuals: ["id"] });
    delete user._id;
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
