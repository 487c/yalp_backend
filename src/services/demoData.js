import { CourseModel } from "../models/course.js";
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

  const count = await UserModel.countDocuments();
  // Get a random entry
  var random = Math.floor(Math.random() * count);
  await UserModel.findOne().skip(random);

  const courses = [
    {
      name: "Math",
      code: "MATH101",
      description: "This is a math course",
    },
    {
      name: "English",
      code: "ENGL101",
      description: "This is an english course",
    },
    {
      name: "Science",
      code: "SCIE101",
      description: "This is a science course",
    },
  ];

  const createdCourses = await Promise.all(
    courses.map(async function (course) {
      var random = Math.floor(Math.random() * count);
      const user = await UserModel.findOne().skip(random);
      course.owner = user._id;
    //   course.code = inviteCodeGenerator();
      return course;
    })
  );
  await CourseModel.insertMany(createdCourses);
  console.log("Demo courses loaded");
}
