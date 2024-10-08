import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import referralCodeGenerator from "referral-code-generator";
import ErrorCodes, { CodeError } from "../services/errorCodes.js";
import { shortenSchema } from "../services/utils.js";

function generateInviteCode() {
  return referralCodeGenerator.alphaNumeric("lowercase", 3, 3);
}

export default {
  reducedInfo: ["name", "code", "owner"],
  patchableInfo: ["name" ],
  fullInfo: ["name", "members", "scripts", "code", "owner"],
  model: mongoose.model(
    "Course",
    new mongoose.Schema(
      {
        name: {
          type: String,
          description: "Anzeigename des Kurses.",
          validate: {
            validator: function (v) {
              return v.length > 2; //TODO: Ordentliche validierung für Kursnamen
            },
            message: (props) => `${props.value} must be at least 3 signs long!`,
          },
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
          unique: true,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          description: "Owner of the Course",
          required: true,
        },
      },
      {
        toJSON: {
          transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
          },
        },
      }
    )
  ),

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
      throw ErrorCodes(2000, e);
    }

    const obj = await newCourse.toObject();
    return { name: obj.name, code: obj.code };
  },

  /**
   * Return a course for an User
   * @param {String} code
   * @param {String} userId
   * @returns {Object} Course
   */
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
    if (!course) throw ErrorCodes(2001);
    return course;
  },

  /**
   * Updates Course informations
   * @param {String} code Invite code of the course
   * @param {String} owner id of the owner
   * @param {String} param2 name of the course
   * @returns {Object} course schema
   */
  async update(code, owner, { name }) {
    let course;
    try {
      course = await this.model
        .findOneAndUpdate({ code, owner }, { name }, { new: true })
        .select("name code -_id")
        .lean();
      if (!course) throw ErrorCodes(2002);
    } catch (e) {
      if (e instanceof CodeError) throw e;
      throw ErrorCodes(2002, e);
    }
    return course;
  },

  /**
   * Deletes an course if the user is owner of the course
   * @param {String} code
   * @param {String} owner id
   * @returns {void}
   */
  async delete(code, owner) {
    const course = await this.model.findOne({ code, owner });

    if (!course) throw ErrorCodes(2002);

    if (course.members.length > 1 || !course.members[0].equals(owner)) {
      throw ErrorCodes(2003);
    }
    return await course.deleteOne();
  },

  /**
   * Gets an reduced version of the courses for the user
   * @param {String} userId of the user that requests the coursess
   * @returns {Object[]}
   */
  async getReducedCoursesForUser(userId) {
    const list = await this.model
      .find({ members: userId }, { name: 1, code: 1, _id: 0, owner: 1 })
      .lean();
    return list;
  },

  /**
   * Adds a member to the course and returns the course informations
   * @param {String} code invite code of the course
   * @param {String} userId of the user to add
   * @returns {Object} course
   */
  async addMember(code, userId) {
    const course = await this.model.findOne({ code });

    if (!course) throw ErrorCodes(2001);

    //TODO: Add Deck on join course / create course
    if (!course.members.includes(userId)) {
      course.members.push(userId);
      await course.save();
    }
    return this.getCourseForUser(code, userId);
  },

  /**
   * Deletes a member from the course
   * @param {String} code
   * @param {String} userId of the user
   */
  async deleteMember(code, userId) {
    const course = await this.model.findOne({ code });
    if (!course.members.includes(userId)) throw ErrorCodes(2001);

    if (course.owner === userId) throw ErrorCodes(2005);

    if (course.members.length < 1) throw ErrorCodes(2006);

    course.members.splice(course.members.indexOf(userId), 1);
    await course.save();
  },

  /**
   * Changes the ownership of the course
   * @param {String} code invite code of the course
   * @param {String} userId of the user
   * @param {String} newOwner id of the new owner
   * @returns
   */
  async changeOwner(code, fromUser, toUser) {
    const course = await this.model.findOne({
      code,
      owner: fromUser,
      members: toUser,
    });

    if (!course) throw ErrorCodes(2007);

    return await course.set("owner", toUser).save();
  },

  getApiSchema(title, type) {
    return shortenSchema(m2s(this.model), title, this[type]);
  },
};
