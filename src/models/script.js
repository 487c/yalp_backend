import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { randomUUID } from "crypto";
import Course from "./course.js";
import File from "./file.js";
import ErrorCode from "../services/errorCodes.js";

export default {
  model: mongoose.model("Script", {
    uuid: {
      type: mongoose.Schema.Types.UUID,
      description: "UUID des Skriptes",
      required: true,
      default: () => randomUUID(),
    },
    name: {
      type: String,
      description: "Anzeigename des Dokumentes in der Applikation",
      required: true,
    },
    description: {
      type: String,
      description: "Beschreibung des Skripts in der Applikation",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      description: "Kurs zu dem das Skript gehört",
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
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      description: "The files in the script",
    },
  }),

  async createScript(courseCode, userId, { name, description = "" }) {
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
        owner: userId,
        name,
        description:
          typeof description === "string"
            ? description
            : JSON.stringify(description),
      });
    } catch (e) {
      throw ErrorCode(3003, e);
    }
    course.scripts.push(newScript._id);
    return { uuid: newScript.uuid };
  },

  async setScriptFile(uuid, userId, { file, name, modifiedDate }) {
    const script = await this.model
      .findOne({ uuid }, { file: 1, course: 1 })
      .populate("course", { members: 1 });

    if (!script) throw ErrorCode(3001);
    if (!this.userIn(script, userId))
      throw { code: 3004, message: "Not a member of the course" };

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
    const script = await this.model
      .findOne({ uuid, file: undefined }, { _id: 0, __v: 0 })
      .populate("course", { members: 1 })
      .populate("cards", { _id: 0, __v: 0 })
      .lean();

    if (!script.file) throw ErrorCode(3005);

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

  async deleteScript({ uuid }) {
    await this.model.delete(uuid);
  },

  getReducedSchema() {
    return m2s(this.model, {
      props: ["name", "fileName"],
      omitFields: ["_id", "cards", "markdown", "file", "uuid", "course"],
    });
  },
};
