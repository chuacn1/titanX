import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { setupTestAuth } from "./helpers/auth.js";

console.log("🔍 DEBUG: Starting tests...");
console.log("App type:", typeof app);
console.log("setupTestAuth type:", typeof setupTestAuth);

describe("User CRUD", () => {
  let token;
  let userOneId;
  let userTwoId;

  // Setup the test authentication before running the tests
  before(async () => {
    token = await setupTestAuth();
  });

  it("should create user one", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "testuser1",
        email: "test1@example.com",
        password: "P@ssword123.",
        age: "25",
        role: "NORMAL"
      });

      console.log("Create user one - Status:", res.status);
      console.log("Create user one - Headers:", res.headers);
      console.log("Create user one - Body:", res.body);
      
    expect(res.status).to.equal(201);

    // Find a user by username in the response body
    const newUser = res.body.data.find(
      (user) => user.username === "testuser1"
    );
    userOneId = newUser.id; // Store the user id for later use
  });


  it("should create user two", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "testuser2",
        email: "test2@example.com",
        password: "P@ssw0rddd!.",
        age: "30",
        role: "ADMIN"
      });

      console.log("Create user two - Status:", res.status);
      console.log("Create user two - Headers:", res.headers);
      console.log("Create user two - Body:", res.body);
      
    expect(res.status).to.equal(201);
    const newUser = res.body.data.find(
      (user) => user.username === "testuser2"
    );
    userTwoId = newUser.id;
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    
      console.log("Get all Users:", res.body);
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2); // Check that there are at least 2 users
  });

  it("should get user one by ID", async () => {
    const res = await request(app)
      .get(`/api/users/${userOneId}`)
      .set("Authorization", `Bearer ${token}`);

      console.log("Get user one - Status:", res.status);
      console.log("Get user one - Headers:", res.headers);
      console.log("Get user one - Body:", res.body);
      
    expect(res.status).to.equal(200);
    expect(res.body.data.username).to.equal("testuser1");
  });

  it("should update user two", async () => {
    const res = await request(app)
      .put(`/api/users/${userTwoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        username: "updateduser2", 
        age: "35",
        role: "NORMAL"
      });

      console.log("Update user two - Status:", res.status);
      console.log("Update user two - Headers:", res.headers);
      console.log("Update user two - Body:", res.body);
      
      expect(res.status).to.equal(200);
      // Update the expected message to match your API
      expect(res.body.message).to.equal("User updated successfully");
  });

  it("should delete user one", async () => {
    const res = await request(app)
      .delete(`/api/users/${userOneId}`)
      .set("Authorization", `Bearer ${token}`);

      console.log("Delete User One- Status:", res.status);
      console.log("Delete User One- Headers:", res.headers);
      console.log("Delete User One- Body:", res.body);
      
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(  "User deleted successfully");
  });

  after(() => {
    global.testUserId = userTwoId; // Store the user id for later use in other test files
  });
});