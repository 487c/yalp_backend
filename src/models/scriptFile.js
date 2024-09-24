import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { randomUUID } from "crypto";

export default {
  model: mongoose.model("File", {
    name: {
      type: String,
      description: "Dateiname der Pdf",
      required: true,
    },
    md5: {},
    file: {
      type: Buffer,
      description: "Base64 kodiertes PDF",
      // required: true,
    },
    dateUpload: {
      type: Date,
      description: "Hochladedatum des Skriptes",
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

  async createScript({ name, fileName, dateModified }) {
    const newScript = await this.model.create({
      name,
      fileName,
      dateModified,
      dateUpload: new Date(),
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
