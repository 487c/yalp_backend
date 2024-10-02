import Course from "../models/course.js";
import User from "../models/user.js";
import Script from "../models/script.js";
import fs from "fs";

import { createHash } from 'node:crypto'

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function loadDemoData() {
  await loadUsers();
  await loadCourses();
  await loadScripts();
  return true;
}

async function loadUsers() {
  await User.model.deleteMany({});
  await User.model.insertMany([
    {
      name: "John Doe",
      login: "johnwhoRidesDoes",
    },
    {
      name: "Jane Doe",
      login: "janeIsLikeSuperGreat",
    },
    {
      name: "Alice",
      login: "aliceIsInWonderland",
    },
    {
      name: "Bob",
      login: "bobIsNotYourUncle",
    },
    {
      name: "Charlie",
      login: "charlieIsNotTheUncle",
    },
  ]);
  console.log("Demo data loaded");
}

async function loadCourses() {
  console.log("Loading course data");
  await Course.model.deleteMany({});

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
          name: "Exitcourse",
          code: "EXITISGREAT101",
          owner: users[0]._id,
        }),
      ])
  );

  console.log("Demo courses loaded");
}

function makeUUID(str) {
  return str;
  // new mongoose.Types.UUID(str);
}

/**
 * TODO: Insert usefull demo data
 *
 */
async function loadScripts() {
  await Script.model.deleteMany({});
  const user = await User.model.find({ login: "johnwhoRidesDoes" });

  const scripts = [
    {
      name: "Algebra",
      description: "Algebra is super duper great.",
      code: "MATHISGREAT101",
      uuid: makeUUID("f317ee1a-00fc-4682-a79c-58c1cf1859ae"),
    },
    {
      name: "Mengenlehre",
      description: "Mengenlehre ist nichts für Anfänger",
      code: "MATHISGREAT101",
      uuid: makeUUID("1e274ba0-b772-4edd-8c04-b5291af2e8bb"),
    },
    {
      name: "Trigonometry",
      description: "Lehre über Trigonometrie",
      code: "MATHISGREAT101",
      uuid: makeUUID("2c01f96d-69c4-4a0f-b8b0-0ee2f539871e"),
    },
    {
      name: "Grammatik",
      code: "DEUTSCHISGREAT101",
      description: "Grammatik ist super wichtig",
      uuid: makeUUID("a4022ea6-a6b0-42f4-b7fe-e0c7a04a7320"),
    },
    {
      name: "Rechtschreibung",
      code: "DEUTSCHISGREAT101",
      description: "Rechtschreibung sollte beachtet werden",
      uuid: makeUUID("c6326f9a-6873-4ea9-92e3-1af68ae36a03"),
    },
    {
      name: "Vokabeln",
      code: "DEUTSCHISGREAT101",
      description: "Vokabeln sind super wichtig",
      uuid: makeUUID("e5d8d7f3-4d1f-4c7d-8e0e-0b0f5b0e5f0f"),
    },
    {
      name: "Vocabulary",
      code: "ENGLISHISGREAT101",
      description: "Vocabulary is super important",
      uuid: makeUUID("f5d8d7f3-4d1f-4c7d-8e0e-0b0f5b0e5f0f"),
    },
    {
      name: "Grammar",
      code: "ENGLISHISGREAT101",
      description: "Grammar is super important",
      uuid: makeUUID("c2687d73-9fc1-43ca-877e-0ca365535107"),
    },
    {
      name: "Reading",
      code: "ENGLISHISGREAT101",
      description: "Reading is super important",
      uuid: makeUUID("b5f38a4b-c8c2-4063-b3fe-436e30410ab2"),
    },
  ];

  const courses = await Course.model.find({
    code: { $in: Array.from(new Set(scripts.map((s) => s.code)).values()) },
  });
  const fileBuff = fs.readFileSync(__dirname + "/../../test/example_file.pdf");
  const base64 = fileBuff.toString("base64")
  const created = await Script.model.insertMany(
    scripts.map((script) => ({
      name: script.name,
      description: script.description,
      owner: user._id,
      file: base64,
      uuid: script.uuid,
      md5: createHash('md5').update(base64).digest("hex"),
      course: courses.find((c) => c.code === script.code)._id,
      fileDateModified: fs.statSync(__dirname + "/../../test/example_file.pdf").mtime,
      cards: [],
    }))
  );

  created.forEach((script, i) => {
    const course = courses.find((c) => c.code === scripts[i].code);
    course.scripts.push(script._id);
  }),
    await Promise.all(courses.map((course) => course.save()));
}
