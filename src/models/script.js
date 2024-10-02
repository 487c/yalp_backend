import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import Course from "./course.js";
import ErrorCode from "../services/errorCodes.js";
import { shortenSchema } from "../services/utils.js";
import { createHash, randomUUID } from "node:crypto";

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
          select: false,
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
        },
        cards: {
          type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
          description: "Kartenids zu einem Skript",
        },
        dateCreated: {
          type: Date,
          description: "Erstellungsdatum des Skriptes",
          default: Date.now,
          required: true,
        },
      },
      {
        toJSON: {
          virtuals: true,
          useProjection: true,
          transform: function (doc, ret) {
            ret.file = doc.file.toString("base64");
            delete ret._id;
            delete ret.__v;
            ret.course = doc.course.toString();
          },
        },
      }
    )
  ),

  async createScript(
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
        uuid: randomUUID(),
        file: Buffer.from(file, "base64"),
        fileDateModified,
        course: course._id,
        md5: createHash("md5").update(file).digest("hex"),
        cards: [],
      });
    } catch (e) {
      throw ErrorCode(3003, e);
    }
    course.scripts.push(newScript._id);
    return newScript.toJSON();
  },

  async setScriptFile(uuid, userId, { file, name, modifiedDate }) {
    const script = await this.model
      .findOne({ uuid }, { file: 1, course: 1 })
      .populate("course", { members: 1 });

    if (!script) throw ErrorCode(3001);
    if (!this.userIn(script, userId)) throw ErrorCode(3004);

    const fileId = await File.create(file, name, modifiedDate);
    script.file = fileId;
    return await script.save();
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

  async getScriptForUser(uuid, userId) {
    if (!uuid) throw ErrorCode(3006);
    const script = await this.model
      .findOne({ uuid }, { _id: 0, __v: 0 })
      .populate("course", { members: 1 })
      .lean();
    // .populate("cards", { _id: 0, __v: 0 })

    if (!script) throw ErrorCode(3001);

    if (!script.course.members.find((m) => m.equals(userId)))
      throw ErrorCode(3004);

    delete script.course;

    return script;
  },

  async getScriptFile({ uuid }) {
    const script = await this.model.find(uuid);
    return script.file;
  },

  getApiSchema(title, type) {
    return shortenSchema(m2s(this.model), title, this[type]);
  },
};
