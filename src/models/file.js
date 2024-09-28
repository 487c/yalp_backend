import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import md5 from "md5";
import { randomUUID } from "crypto";

export default {
  model: mongoose.model("File", {
    name: {
      type: String,
      description: "Anzeigenamename der Datei",
      required: true,
    },
    orginalName: {
      type: String,
      description: "Dateiname der Dokumentes",
      required: true,
    },
    uuid: {
      type: String,
      description: "Dateiname der Dokumentes",
      required: true,
      default: randomUUID,
    },
    mimeType: {
      type: String,
      description: "Mime Type der Datei",
      required: true,
    },
    file: {
      type: Buffer,
      description: "File Content",
      required: true,
    },
    md5: {},
    dateUpload: {
      type: Date,
      description: "Hochladedatum des Skriptes",
      default: Date.now,
      required: true,
    },
    dateModified: {
      type: Date,
      description: "Letztes Änderungsdatum der Datei",
      required: true,
    },
    markdown: {
      type: Buffer,
      description: "Markdown des Skriptes",
    },
  }),

  async create(file, name, dateModified) {
    if (file.size > 16000000) throw "The file is to big, max size is 16MB";
    const newScript = await this.model.create({
      file: file.buffer,
      name,
      md5: md5(file.buffer),
      mimeType: file.mimetype,
      orginalName: file.originalname,
      dateModified: new Date(dateModified).valueOf(),
    });
    return newScript._id;
  },

  async setScriptFile({ uuid, file }) {
    const script = await this.model.findById(uuid);
    script.file = file;
    await script.save();
  },

  async getScriptMeta({ uuid }) {
    const script = await this.model.find(uuid);
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
      omitFields: ["_id", "cards", "markdown", "file", "uuid"],
    });
  },
};
