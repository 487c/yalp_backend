import Course from "../models/course.js";
import { UserModel } from "../models/user.js";
export default async function loadDemoData() {
  await loadUsers();
  return await Promise.all([loadCourses()]);
}

async function loadUsers() {
  console.log("Loading user data");
  await UserModel.deleteMany({});
  await UserModel.insertMany([
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

  const users = await UserModel.find();

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
  ];

  await Promise.all(
    courses.map(async function (course, index) {
      return Course.create({
        name: course.name,
        code: course.code,
        owner: users[index]._id,
        members: [users[index]._id, users.at(index - 1)._id],
      });
    })
  );

  console.log("Demo courses loaded");
}
