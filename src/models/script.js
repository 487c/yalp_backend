import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { randomUUID } from "crypto";
import Course from "./course.js";

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
    file: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        description: "The files in the script",
      },
    ],
  }),

  async createScript(courseCode, userId, { name, description = "" }) {
    const course = await Course.model
      .findOne({
        code: courseCode,
        members: userId,
      })
      .populate("scripts");

    if (!course) throw "Course not found";

    const newScript = await this.model.create({
      owner: userId,
      name,
      description:
        typeof description === "string"
          ? description
          : JSON.stringify(description),
    });
    course.scripts.push(newScript._id);
    return { uuid: newScript.uuid };
  },

  async setScriptFile({ uuid, file }) {
    const script = await this.model.findById(uuid);
    script.file = file;
    await script.save();
  },

  async getScriptMeta({ uuid }) {
    const script = await this.model.find(uuid);
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
      omitFields: ["_id", "cards", "markdown", "file", "uuid"],
    });
  },
};
