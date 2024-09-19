import { CourseModel, createCourse } from "../models/course.js";
import { UserModel } from "../models/user.js";
import { inviteCodeGenerator } from "../models/course.js";
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
  await CourseModel.deleteMany({});

  const users = await UserModel.find();

  const courses = [
    {
      name: "Math",
      code: "MATH101",
    },
    {
      name: "English",
      code: "ENGL101",
    },
    {
      name: "Science",
      code: "SCIE101",
    },
  ];

  const createdCourses = await Promise.all(
    courses.map(async function (course, index) {
      return createCourse({
        name: course.name,
        owner: users[index]._id,
      });
    })
  );
  console.log("Demo courses loaded");
}
