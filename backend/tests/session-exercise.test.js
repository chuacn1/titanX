import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { setupTestAuth } from "./helpers/auth.js";
import prisma from "../prisma/client.js";

describe("Session Exercise CRUD", () => {
    let token;
    let sessionExerciseOneId;
    let sessionExerciseTwoId;
    let workoutSessionId;
    let exerciseOneId;
    let exerciseTwoId;

    before(async () => {
        token = await setupTestAuth();
        
        // Clean up first
        await prisma.sessionExercise.deleteMany();
        await prisma.workoutSession.deleteMany();
        await prisma.exercise.deleteMany();

        // 1. Create a WorkoutSession first
        const workoutSession = await prisma.workoutSession.create({
            data: {
                notes: "Test workout session",
                user: {
                    connect: { id: "test-admin-id-123" } // Use the same user from setupTestAuth
                }
            }
        });
        workoutSessionId = workoutSession.sessionID;

        // 2. Create Exercises
        const exercise1 = await prisma.exercise.create({
            data: {
                name: "Test Exercise 1",
                muscleGroup: "PUSH"
            }
        });
        exerciseOneId = exercise1.exerciseID;

        const exercise2 = await prisma.exercise.create({
            data: {
                name: "Test Exercise 2", 
                muscleGroup: "LEGS"
            }
        });
        exerciseTwoId = exercise2.exerciseID;
    });

    it("should create session exercise one", async () => {
        const res = await request(app)
            .post("/api/session-exercise") // Note: singular, not plural
            .set("Authorization", `Bearer ${token}`)
            .send({
                sets: 4,
                reps: 12,
                weight: 50.5,
                sessionID: workoutSessionId, // Use the created session ID
                exerciseID: exerciseOneId    // Use the created exercise ID
            });

        console.log("Create session exercise one - Status:", res.status);
        console.log("Create session exercise one - Body:", res.body);

        expect(res.status).to.equal(201);
        expect(res.body.data).to.have.property("sessionExerciseID");
        expect(res.body.data.sets).to.equal(4);

        sessionExerciseOneId = res.body.data.sessionExerciseID;
    });

    it("should create session exercise two", async () => {
        const res = await request(app)
            .post("/api/session-exercise") // Note: singular, not plural
            .set("Authorization", `Bearer ${token}`)
            .send({
                sets: 3,
                reps: 10,
                weight: 60.0,
                sessionID: workoutSessionId, // Use the created session ID
                exerciseID: exerciseTwoId    // Use the created exercise ID
            });

        console.log("Create session exercise two - Status:", res.status);
        console.log("Create session exercise two - Body:", res.body);

        expect(res.status).to.equal(201);
        sessionExerciseTwoId = res.body.data.sessionExerciseID;
    });

    it("should get session exercises by session ID", async () => {
        const res = await request(app)
            .get(`/api/session-exercise/${workoutSessionId}`) // Use created session ID
            .set("Authorization", `Bearer ${token}`);

        console.log("Get session exercises by session ID - Status:", res.status);
        console.log("Get session exercises by session ID - Body:", res.body);

        expect(res.status).to.equal(200);
    });

    it("should delete session exercise one", async () => {
        const res = await request(app)
            .delete(`/api/session-exercise/${sessionExerciseOneId}`)
            .set("Authorization", `Bearer ${token}`);

        console.log("Delete session exercise one - Status:", res.status);
        console.log("Delete session exercise one - Body:", res.body);

        expect(res.status).to.equal(200);
    });
});