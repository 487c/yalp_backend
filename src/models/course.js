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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      description: "Owner of the Course",
      required: true,
    },
  }),

  async create({ name, owner, code, members }) {
    let newCourse;
    try {
      newCourse = await this.model.create({
        name,
        members: members || [owner],
        scripts: [],
        code: code || generateInviteCode(),
        owner: owner,
      });
    } catch (e) {
      throw { code: 2000, message: e };
    }

    const obj = await newCourse.toObject();
    return { name: obj.name, code: obj.code };
  },

  async getCourseForUser(code, userId) {
    const course = await this.model
      .findOne(
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
    if (!course)
      throw {
        code: 2001,
        message: "Could not find course/you are not a member of this course",
      };
    return course;
  },

  async update(code, owner, { name }) {
    let course;
    try {
      course = await this.model
        .findOneAndUpdate({ code, owner }, { name }, { new: true })
        .select("name code -_id")
        .lean();
      if (!course)
        throw "Could not find course/you are not owner of the course";
    } catch (e) {
      throw {
        code: 2002,
        message: e,
      };
    }
    return course;
  },

  async delete(code, owner) {
    const course = await this.model.findOne({ code, owner });

    if (!course) {
      throw {
        code: 2002,
        message: "Could not find course / you are not owner of the course",
      };
    }

    if (course.members.length > 1 || !course.members[0].equals(owner)) {
      throw {
        code: 2003,
        message: "You are not the sole member of the course",
      };
    }
    return await course.deleteOne();
  },

  async getReducedCoursesForUser(userId) {
    return await this.model
      .find({ members: userId }, { name: 1, code: 1, _id: 0 })
      .lean();
  },

  async addMember(code, userId) {
    const course = await this.model.findOne({ code });

    if (!course)
      throw {
        code: 2001,
        message: "Could not find course/you are not a member of this course",
      };

    if (course.members.includes(userId))
      throw {
        code: 2004,
        message: "You are already member of the course",
      };

    course.members.push(userId);
    await course.save();
    return this.getCourseForUser(code, userId);
  },

  async deleteMember(code, userId) {
    const course = await this.model.findOne({ code });
    if (!course.members.includes(userId))
      throw {
        code: 2001,
        message: "Could not find course or user is not a member of the course",
      };

    if (course.owner === userId)
      throw {
        code: 2005,
        message: "You are not owner of course (delete Course)",
      };

    if (course.members.length < 1)
      throw {
        code: 2006,
        message: "You is something wrong, the course has no members",
      };

    course.members.splice(course.members.indexOf(userId), 1);
    await course.save();
  },

  async changeOwner(code, userId, newOwner) {
    const course = await Course.getCourse({ code: code });

    if (!course.owner.equals(userId))
      throw {
        code: 2006,
        message: "You are not owner of the course. Bugger off",
      };

    const candidate = await User.findUserByName({
      name: newOwner,
    });

    if (!candidate)
      throw {
        code: 2007,
        message: "The given name does not correspond to an user.",
      };

    if (course.owner.equals(candidate._id))
      throw { code: 2008, message: "You are already owner of the course." };

    course.owner = candidate._id;
    return await course.save();
  },

  getReducedSchema() {
    return m2s(this.model, {
      props: ["name", "code"],
      omitMongooseInternals: true,
    });
  },
};
