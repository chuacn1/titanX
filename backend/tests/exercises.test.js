import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { setupTestAuth } from "./helpers/auth.js";
import prisma from "../prisma/client.js";

describe("Exercise CRUD", () => {
  let token;
  let exerciseOneId;
  let exerciseTwoId;

  before(async () => {
    token = await setupTestAuth();
    await prisma.exercise.deleteMany();
  });

 it("should create exercise one", async () => {
    const res = await request(app)
      .post("/api/exercises")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "haha",
        muscleGroup: "PUSH"
      });

    console.log("🔍 Full response:", JSON.stringify(res.body, null, 2));
    console.log("🔍 Has data property?", 'data' in res.body);
    console.log("🔍 Data value:", res.body.data);

    // Check if data exists before trying to access exerciseID
    if (res.body.data) {
        console.log("🔍 Data has exerciseID?", 'exerciseID' in res.body.data);
        exerciseOneId = res.body.data.exerciseID;
    }

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('data'); // Check data exists first
    expect(res.body.data).to.have.property("exerciseID");
    expect(res.body.data.name).to.equal("haha");
});

    exerciseOneId = res.body.data.exerciseID;
  });

  it("should create exercise two", async () => {
    const res = await request(app)
      .post("/api/exercises")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "hihi",
        muscleGroup: "LEGS"
      });

    console.log("Create exercise two - Status:", res.status);
    console.log("Create exercise two - Body:", res.body);
    console.log("Create exercise one - Error details:", res.body.errors); 

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Exercise created successfully");
    exerciseTwoId = res.body.data.exerciseID;
  });

  it("should get all exercises", async () => {
    const res = await request(app)
      .get("/api/exercises")
      .set("Authorization", `Bearer ${token}`);

    console.log("Get all Exercises - Status:", res.status);
    console.log("Get all Exercises - Body:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2);
  });

  it("should get exercise by ID", async () => {
    const res = await request(app)
      .get(`/api/exercises/${exerciseOneId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Get exercise by ID - Status:", res.status);
    console.log("Get exercise by ID - Body:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body.data.exerciseID).to.equal(exerciseOneId);
  });

  it("should update exercise", async () => {
    const res = await request(app)
      .put(`/api/exercises/${exerciseOneId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "LELELE",
      });

    console.log("Update exercise - Status:", res.status);
    console.log("Update exercise - Body:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body.data.description).to.equal(
      "An updated description for Push Ups"
    );
  });

  it("should delete exercise", async () => {
    const res = await request(app)
      .delete(`/api/exercises/${exerciseTwoId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete exercise - Status:", res.status);
    console.log("Delete exercise - Body:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Exercise deleted successfully");
  });

