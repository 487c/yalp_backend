import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { modelOpts } from "../options.js";

export const course = mongoose.model("Course", {
  name: {
    type: String,
    description: "Anzeigename des Kurses.",
    required: true,
  },
  users: {
    type: [String],
    description: "Ids der User",
    required: true,
  },
  scripts: {
    type: [String],
    description: "Ids von Skripten zu einer Kurs.",
    required: true
  }
});

export const CourseSchema = m2s(course, modelOpts);
