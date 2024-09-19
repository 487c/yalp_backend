import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { modelOpts } from "../options.js";
import referralCodeGenerator from "referral-code-generator";

export const CourseModel = mongoose.model("Course", {
  name: {
    type: String,
    description: "Anzeigename des Kurses.",
    required: true,
  },
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    description: "Ids der User",
    required: true,
  },
  scripts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Script" }],
    description: "Ids von Skripten zu einer Kurs.",
    required: true,
  },
  code: {
    type: String,
    description: "Invite Code für andere User",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    description: "Owner of the Course",
    required: true,
  },
});

export async function createCourse({ name, owner }) {
  if (await CourseModel.findOne({ name })) {
    throw { status: 400, message: "Course with name already existing." };
  }
  const newCourse = await CourseModel.create({
    name,
    members: [owner],
    scripts: [],
    code: inviteCodeGenerator(),
    owner: owner,
  });

  return await newCourse.toObject();
}

export function inviteCodeGenerator() {
  return referralCodeGenerator.alphaNumeric("lowercase", 3, 3);
}

export const CourseSchema = m2s(CourseModel, modelOpts);
