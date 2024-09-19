import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import referralCodeGenerator from "referral-code-generator";

function generateInviteCode() {
  return referralCodeGenerator.alphaNumeric("lowercase", 3, 3);
}

export default {
  model: mongoose.model("Course", {
    name: {
      type: String,
      description: "Anzeigename des Kurses.",
      min: 3,
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
      min: 10,
      undefined: true,
    },
    owner: {
      type: String,
      ref: "User",
      description: "Owner of the Course",
      required: true,
    },
  }),

  async create({ name, owner, code, members }) {
    if (await this.model.findOne({ name })) {
      throw { status: 400, message: "Course with name already existing." };
    }
    const newCourse = await this.model.create({
      name,
      members: members || [owner],
      scripts: [],
      code: code || generateInviteCode(),
      owner: owner,
    });

    return await newCourse.toObject();
  },

  async getCourseForUser(code, userId) {
    return await this.model
      .find(
        {
          code,
          members: userId,
        },
        { _id: 0, __v: 0 }
      )
      .populate({
        path: "members",
        select: "name -_id",
      })
      .populate("owner", "name -_id")
      .lean();
  },

  async updateCourse({ code, owner, name }) {
    const course = await this.model
      .findOneAndUpdate({ code, owner }, { name }, { new: true })
      .select("name code -_id")
      .lean();
  },

  async getReducedCourses(query) {
    return await this.model.find(query, { name: 1, code: 1, _id: 0 }).lean();
  },

  async testForName(name) {
    return await this.model
      .findOne({ name })
      .then((course) => course !== null)
      .catch((err) => {
        console.error(err);
        return false;
      });
  },

  getReducedSchema() {
    return m2s(this.model, {
      props: ["name", "code"],
      omitMongooseInternals: true,
    });
  },
};
