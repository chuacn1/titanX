import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { setupTestAuth } from "./helpers/auth.js";

describe("Workout Session CRUD", () => {
  let token;
  let workoutSessionOneId;
  let workoutSessionTwoId;

  before(async () => {
    token = await setupTestAuth();
  });
  
  it("should create workout session one", async () => {
    const res = await request(app)
      .post("/api/workout-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        notes: "Morning workout session",
        // No id needed it comes from the token
      });

    console.log("Create workout session one - Status:", res.status);
    console.log("Create workout session one - Body:", res.body);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Workout session created successfully");
    expect(res.body.data).to.have.property("sessionID");
    expect(res.body.data.notes).to.equal("Morning workout session");

    workoutSessionOneId = res.body.data.sessionID;
  });

  it("should create workout session two", async () => {
    const res = await request(app)
      .post("/api/workout-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        notes: "Evening workout session",
      });

    console.log("Create workout session two - Status:", res.status);
    console.log("Create workout session two - Body:", res.body);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Workout session created successfully");
    workoutSessionTwoId = res.body.data.sessionID;
  });

  it("should get all workout sessions (admin only)", async () => {
    const res = await request(app)
      .get("/api/workout-sessions")
      .set("Authorization", `Bearer ${token}`);

    console.log("Get all Workout Sessions - Status:", res.status);
    console.log("Get all Workout Sessions - Body:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2);
  });
});
