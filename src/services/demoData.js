import Course from "../models/course.js";
import User from "../models/user.js";
export default async function loadDemoData() {
  await loadUsers();
  return await Promise.all([loadCourses()]);
}

async function loadUsers() {
  console.log("Loading user data");
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
