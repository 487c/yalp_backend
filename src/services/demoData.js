import Course from "../models/course.js";
import User from "../models/user.js";
import Script from "../models/script.js";
import Card from "../models/card.js";
import fs from "fs";

import mongoose from "mongoose";
import { createHash } from "node:crypto";

import { dirname } from "path";
import { fileURLToPath } from "url";
import argon2 from "argon2";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function loadDemoData() {
  await loadUsers();
  await loadCourses();
  await loadScripts();
  return true;
}

const password = await argon2.hash("password")

async function loadUsers() {
  await User.model.deleteMany({});
  await User.model.insertMany([
    {
      name: "John Doe",
      mail: "john@doemail.com",
      password
    },
    {
      name: "Jane Doe",
      mail: "jane@dabrane.com",
      password,
      _id: "670538fcc348c69519024e7c",
    },
    {
      name: "Alice",
      password,
      mail: "example@mail.com",
    },
    {
      name: "Bob",
      password,
      mail: "bobby@brown.com",
    },
    {
      name: "Charlie",
      password,
      mail: "chales@barkley.com",
    },
  ]);
  console.log("Demo data loaded");
}

async function loadCourses() {
  console.log("Loading course data");
  await Course.model.deleteMany({});
  await Card.model.deleteMany({});

  const users = await User.model.find();

  const courses = [
    {
      name: "Math",
      code: "MATHISGREAT101",
    },
    {
      name: "English",
      code: "ENGLISHISGREAT101",
    },
    {
      name: "Science",
      code: "SCIENCEISGREATE101",
    },
    {
      name: "Deutsch",
      code: "DEUTSCHISGREAT101",
    },
    {
      name: "FRENCH",
      code: "FRENCHISGREAT101",
    },
    {
      name: "Information Technology",
      code: "ITISGREATE101",
    },
    {
      name: "History",
      code: "HISTORYISGREAT101",
    },
    {
      name: "Geography",
      code: "GEOGRAPHYISGREAT101",
    },
  ];

  await Promise.all(
    courses
      .map(async function (course, index) {
        const creator = users[index % users.length];
        const member = users.at((index % users.length) - 1);
        return Course.create({
          name: course.name,
          code: course.code,
          owner: creator._id,
          members: [creator._id, member._id],
        });
      })
      .concat([
        Course.create({
          name: "Sport",
          code: "SPORTSISGREAT101",
          owner: users[0]._id,
        }),
        Course.create({
          name: "Music",
          code: "MUSICISGREAT101",
          owner: users[1]._id,
        }),
        Course.create({
          name: "Art",
          code: "ARTISGREAT101102",
          owner: users[2]._id,
        }),
        Course.create({
          name: "ChangeOwnerCourse",
          code: "CHANGEISGREAT101",
          owner: users[0]._id,
          members: [users[1]._id, users[0]._id],
        }),
        Course.create({
          name: "Exitcourse",
          code: "EXITISGREAT101",
          owner: users[0]._id,
        }),
      ])
  );

  // await Course.addMember("CHANGEISGREATE101", users[1]._id);

  console.log("Demo courses loaded");
}

async function loadScripts() {
  await Script.model.deleteMany({});
  const user = await User.model.find({ name: "John Doe" });

  const scripts = [
    {
      name: "Algebra",
      description: "Algebra is super duper great.",
      code: "MATHISGREAT101",
      _id: "66fdc364ec1a0050d720b667",
    },
    {
      name: "Mengenlehre",
      description: "Mengenlehre ist nichts für Anfänger",
      code: "MATHISGREAT101",
      _id: "57fdc364ec1a0050d720b667",
    },
    {
      name: "Trigonometry",
      description: "Lehre über Trigonometrie",
      code: "MATHISGREAT101",
      _id: "87fdc364ec1a0050d720b667",
    },
    {
      name: "Grammatik",
      code: "DEUTSCHISGREAT101",
      description: "Grammatik ist super wichtig",
      _id: "27fdc364ec1a0050d720b667",
    },
    {
      name: "Rechtschreibung",
      code: "DEUTSCHISGREAT101",
      description: "Rechtschreibung sollte beachtet werden",
      _id: "17fdc364ec1a0050d720b667",
    },
    {
      name: "Vokabeln",
      code: "DEUTSCHISGREAT101",
      description: "Vokabeln sind super wichtig",
      _id: "37fdc364ec1a0050d720b667",
    },
    {
      name: "Vocabulary",
      code: "ENGLISHISGREAT101",
      description: "Vocabulary is super important",
      _id: "47fdc364ec1a0050d720b667",
    },
  ];

  const courses = await Course.model.find({
    code: { $in: Array.from(new Set(scripts.map((s) => s.code)).values()) },
  });
  const fileBuff = fs.readFileSync(__dirname + "/../../test/example_file.pdf");
  const base64 = fileBuff.toString("base64");
  const createdScripts = await Script.model.insertMany(
    scripts.map((script) => ({
      _id: new mongoose.Types.ObjectId(script._id),
      name: script.name,
      description: script.description,
      owner: user[0]._id,
      file: fileBuff,
      md5: createHash("md5").update(base64).digest("hex"),
      course: courses.find((c) => c.code === script.code)._id,
      fileDateModified: fs.statSync(__dirname + "/../../test/example_file.pdf")
        .mtime,
      cards: [],
    }))
  );

  createdScripts.forEach((script, i) => {
    const course = courses.find((c) => c.code === scripts[i].code);
    course.scripts.push(script._id);
  }),
    await Promise.all(courses.map((course) => course.save()));

  const cards = [
    {
      front: "What is 1 + 1",
      back: "2 you dumb ass.",
      id: "63fef46e9af90a018fd01014",
    },
    {
      front: "What is 2 + 1",
      back: "3, much wow, so smart.",
      id: "62fef46e9af90a018fd01094",
    },
    {
      front: "Will this card be deleted???",
      back: "Yes.",
      id: "63fef22222220a018fd01014",
    },
  ];

  createdScripts[0].cards.push(cards[0].id, cards[1].id);

  await Card.model.insertMany(
    cards.map(function (c) {
      return {
        _id: c.id,
        front: c.front,
        back: c.back,
        author: user[0]._id,
        anchor: {
          scriptId: createdScripts[0]._id,
          context: [0],
        },
      };
    })
  );
}
