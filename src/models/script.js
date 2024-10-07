import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import Course from "./course.js";
import ErrorCode from "../services/errorCodes.js";
import Card from "./card.js";
import { shortenSchema } from "../services/utils.js";
import { createHash } from "node:crypto";

export default {
  reducedInfo: ["name", "description"],
  fullInfo: [
    "name",
    "description",
    "file",
    "fileDateModified",
    "course",
    "cards",
    "dateCreated",
    "md5",
    "owner",
    "id",
  ],
  model: mongoose.model(
    "Script",
    mongoose.Schema(
      {
        name: {
          type: String,
          description: "Anzeigename des Dokumentes in der Applikation",
          required: true,
          //TODO: fix validations for real names
          validate: {
            validator: (v) => v.length > 3,
            message: () => `Script name must be at least 3 signs long!`,
          },
        },
        file: {
          type: Buffer,
          description: "File Content",
          required: true,
        },
        fileDateModified: {
          type: Date,
          required: true,
        },
        markdown: {
          type: Buffer,
          description: "Markdown des Skriptes",
        },
        md5: { type: String, required: true },
        description: {
          type: String,
          description: "Beschreibung des Skripts in der Applikation",
          required: true,
        },
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          description: "Kurs UUID zu dem das Skript gehört",
          required: true,
          immutable: true,
        },
        cards: {
          type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
          description: "Kartenids zu einem Skript",
          default: [],
        },
        dateCreated: {
          type: Date,
          description: "Erstellungsdatum des Skriptes",
          default: Date.now,
          required: true,
          immutable: true,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          immutable: true,
          required: true,
        },
      },
      {
        toJSON: {
          transform: function (doc, ret) {
            ret.file = doc.file.toString("base64");
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            ret.course = doc.course.toString();
          },
        },
      }
    )
  ),

  /**
   * Creates a new Script
   * @param {String} courseCode
   * @param {String} userId
   * @param {Object} script
   * @param {String} script.name
   * @param {String} script.description
   * @param {String} script.file in base64
   * @param {String} script.fileDateModified in base64
   * @returns
   */
  async create(
    courseCode,
    userId,
    { name, description, file, fileDateModified }
  ) {
    const course = await Course.model
      .findOne({
        code: courseCode,
        members: userId,
      })
      .populate("scripts");

    if (!course) throw ErrorCode(3001);
    if (course.scripts.find((script) => script.name === name))
      throw ErrorCode(3002);

    let newScript;
    try {
      newScript = await this.model.create({
        name,
        description,
        owner: userId,
        file: Buffer.from(file, "base64"),
        fileDateModified,
        course: course._id,
        md5: createHash("md5").update(file).digest("hex"),
      });
    } catch (e) {
      throw ErrorCode(3003, e);
    }
    course.scripts.push(newScript._id);
    return newScript.toJSON();
  },

  /**
   * Deletes the Script if:
   * 1. It has no cards
   * @param {String} id
   * @param {String} userId
   */
  async delete(id, userId) {
    const loadingScript = this.get(id, userId);

    const loadingCard = Card.model.findOne({ "anchor.scriptId": id });

    const [script, card] = await Promise.all([loadingScript, loadingCard]);
    if (card) throw ErrorCode(3008);
    if (!script) throw ErrorCode(3001);

    return await this.model.deleteOne({ id });
  },

  /**
   * Updates the script name and description
   * @param {String} id
   * @param {String} userId
   * @param {Object} param2
   * @param {String} [param2.name]
   * @param {String} [param2.description]
   * @returns
   */
  async update(id, userId, { name, description }) {
    const script = await this.get(id, userId);

    if (name) script.name = name;
    if (description) script.description = description;

    try {
      return await script.save();
    } catch (e) {
      throw ErrorCode(3005, e);
    }
  },

  /**
   *
   * @param {mongoose.Schema} script
   * @param {String} userId
   * @returns
   */
  userIn(script, userId) {
    return script.course.members.some((m) => m.equals(userId));
  },

  /**
   * Returns the script with the id and the userId that must be member
   * @param {String} id of the script
   * @param {String} userId userId
   * @param {Object} populate
   * @param {boolean} card
   * @returns {Object}
   */
  async get(id, userId, populate = { cards: false }) {
    if (!id) throw ErrorCode(3006);
    let script;
    try {
      const promise = this.model
        .findOne({ _id: id }, { __v: 0 })
        .populate("course", { members: 1 });
      if (populate.cards) promise.populate("cards");
      script = await promise;
    } catch (e) {
      throw ErrorCode(3007, e);
    }

    if (!script) throw ErrorCode(3001);

    if (!this.userIn(script, userId)) throw ErrorCode(3004);

    return script;
  },

  getApiSchema(title, type) {
    return shortenSchema(m2s(this.model), title, this[type]);
  },
};
