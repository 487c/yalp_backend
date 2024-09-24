import Course from "../models/course.js";
import User from "../models/user.js";
import Script from "../models/script.js";
import { randomUUID } from "crypto";
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
      login: "john",
    },
    {
      name: "Jane Doe",
      login: "jane",
    },
    {
      name: "Alice",
      login: "alice",
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
      ])
  );

  console.log("Demo courses loaded");
}

async function loadScripts() {
  await Script.model.deleteMany({});
  const user = await User.model.find({ login: "john" });

  const scripts = [
    {
      name: "Algebra",
      description: "Algebra is super duper great.",
      code: "MATHISGREAT101",
      uuid: "f317ee1a-00fc-4682-a79c-58c1cf1859ae",
    },
    {
      name: "Mengenlehre",
      description: "Mengenlehre ist nichts für Anfänger",
      code: "MATHISGREAT101",
      uuid: "1e274ba0-b772-4edd-8c04-b5291af2e8bb",
    },
    {
      name: "Trigonometry",
      description: "Lehre über Trigonometrie",
      code: "MATHISGREAT101",
      uuid: "2c01f96d-69c4-4a0f-b8b0-0ee2f539871e",
    },
    {
      name: "Grammatik",
      code: "DEUTSCHISGREAT101",
      description: "Grammatik ist super wichtig",
      uuid: "a4022ea6-a6b0-42f4-b7fe-e0c7a04a7320",
    },
    {
      name: "Rechtschreibung",
      code: "DEUTSCHISGREAT101",
      description: "Rechtschreibung sollte beachtet werden",
      uuid: "c6326f9a-6873-4ea9-92e3-1af68ae36a03",
    },
  ];

  const created = await Script.model.insertMany(
    scripts.map((script) => ({
      name: script.name,
      description: script.description,
      owner: user._id,
      uuid: script.uuid,
      cards: [],
    }))
  );

  const courses = await Course.model.find({
    code: { $in: Array.from(new Set(scripts.map((s) => s.code)).values()) },
  });

  created.forEach((script, i) => {
    const course = courses.find((c) => c.code === scripts[i].code);
    course.scripts.push(script._id);
  }),
    await Promise.all(courses.map((course) => course.save()));

  console.log("Demo courses loaded");
}
