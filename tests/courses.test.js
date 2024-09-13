const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { PUT } = require("../src/api/courses"); // Adjust the path as necessary
const CourseModel = require("../src/api/models/CourseModel"); // Adjust the path as necessary
const inviteCodeGenerator = require("../src/api/inviteCodeGenerator"); // Adjust the path as necessary

jest.mock("./models/CourseModel");
jest.mock("./utils/inviteCodeGenerator");

const app = express();
app.use(bodyParser.json());
app.put("/courses", PUT);

describe("PUT /courses", () => {
  it("should create a new course and return 200 OK", async () => {
    const mockInviteCode = "12345";
    inviteCodeGenerator.mockReturnValue(mockInviteCode);

    const mockCourse = {
      name: "Test Course",
      userIds: ["testUserId"],
      code: mockInviteCode,
    };

    CourseModel.create.mockResolvedValue(mockCourse);

    const response = await request(app)
      .put("/courses")
      .send({ name: "Test Course" })
      .set("userId", "testUserId");

    expect(response.status).toBe(200);
    expect(response.body).toBe("OK");
    expect(CourseModel.create).toHaveBeenCalledWith({
      name: "Test Course",
      userIds: ["testUserId"],
      code: mockInviteCode,
    });
  });

  it("should return 401 if no userId is provided", async () => {
    const response = await request(app)
      .put("/courses")
      .send({ name: "Test Course" });

    expect(response.status).toBe(401);
    expect(response.body).toBe("Missing Token");
  });

  it("should return 403 if token is invalid", async () => {
    // Add logic to simulate invalid token scenario
    const response = await request(app)
      .put("/courses")
      .send({ name: "Test Course" })
      .set("userId", "invalidUserId");

    expect(response.status).toBe(403);
    expect(response.body).toBe("Token invalid.");
  });
});
