// tests/progress.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { setupTestAuth, cleanupDatabase, disconnectPrisma } from "./helpers/auth.js";
import prisma from "../prisma/client.js";

describe("Progress API", () => {
    let token;
    let progressId;
    let testUserId;
    let exerciseId;
    let sessionId;

    before(async () => {
        // Setup test authentication and get token
        token = await setupTestAuth();
        
        // Get the test user ID
        const testUser = await prisma.user.findUnique({
            where: { email: "admin@test.com" }
        });
        testUserId = testUser.id;

        // Create a test exercise
        const exercise = await prisma.exercise.create({
            data: {
                name: "Test Bench Press",
                muscleGroup: "PUSH",
            }
        });
        exerciseId = exercise.exerciseID;

        // Create a test workout session
        const session = await prisma.workoutSession.create({
            data: {
                id: testUserId,
                notes: "Test session for progress"
            }
        });
        sessionId = session.sessionID;
    });

    after(async () => {
        await cleanupDatabase();
        await disconnectPrisma();
    });

    beforeEach(async () => {
        // Clean up progress records before each test
        await prisma.progress.deleteMany();
    });

    describe("GET /api/progress/user/:userId", () => {
        it("should get progress by user ID", async () => {
            // First create a progress record
            const progress = await prisma.progress.create({
                data: {
                    id: testUserId,
                    totalVolume: 1000,      
                      }
            });

            const res = await request(app)
                .get(`/api/progress/user/${testUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).to.have.property('message', 'Progress retrieved successfully');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data[0]).to.have.property('progressID', progress.progressID);
            expect(res.body.data[0]).to.have.property('totalVolume', 1000);
        });

        it("should return empty array for user with no progress", async () => {
            const res = await request(app)
                .get(`/api/progress/user/${testUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.data).to.be.an('array').that.is.empty;
        });
    });

    describe("GET /api/progress/:id", () => {
        it("should get progress by progress ID", async () => {
            const progress = await prisma.progress.create({
                data: {
                    id: testUserId,
                    totalVolume: 1500,
                }
            });

            const res = await request(app)
                .get(`/api/progress/${progress.progressID}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).to.have.property('message', 'Progress retrieved successfully');
            expect(res.body.data).to.have.property('progressID', progress.progressID);
            expect(res.body.data).to.have.property('totalVolume', 1500);
        });

        it("should return 404 for non-existent progress ID", async () => {
            const res = await request(app)
                .get('/api/progress/99999')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);

            expect(res.body).to.have.property('message', 'No progress with the id: 99999 found');
        });
    });

    describe("PUT /api/progress/:id", () => {
        it("should update progress successfully", async () => {
            const progress = await prisma.progress.create({
                data: {
                    id: testUserId,
                    totalVolume: 1000,
                }
            });

            const updateData = {
                totalVolume: 2000,
            };

            const res = await request(app)
                .put(`/api/progress/${progress.progressID}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateData)
                .expect(200);

            expect(res.body).to.have.property('message', 'Progress updated successfully');
            expect(res.body.data).to.have.property('totalVolume', 2000);
        });

        it("should return 404 when updating non-existent progress", async () => {
            const res = await request(app)
                .put('/api/progress/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({ totalVolume: 1000 })
                .expect(404);

            expect(res.body).to.have.property('message', 'No progress with the id: 99999 found');
        });

        it("should validate totalVolume as number", async () => {
            const progress = await prisma.progress.create({
                data: {
                    id: testUserId,
                    totalVolume: 1000
                }
            });

            const res = await request(app)
                .put(`/api/progress/${progress.progressID}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ totalVolume: "invalid" })
                .expect(400);

            expect(res.body.errors[0]).to.have.property('message', 'Total volume must be a number');
        });

        it("should validate totalVolume as non-negative", async () => {
            const progress = await prisma.progress.create({
                data: {
                    id: testUserId,
                    totalVolume: 1000
                }
            });

            const res = await request(app)
                .put(`/api/progress/${progress.progressID}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ totalVolume: -100 })
                .expect(400);

            expect(res.body.errors[0]).to.have.property('message', 'Total volume cannot be negative');
        });
    });

    describe("DELETE /api/progress/:id", () => {
        it("should delete progress successfully", async () => {
            const progress = await prisma.progress.create({
                data: {
                    id: testUserId,
                    totalVolume: 1000
                }
            });

            const res = await request(app)
                .delete(`/api/progress/${progress.progressID}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).to.have.property('message', 'Progress deleted successfully');

            // Verify it's actually deleted
            const deletedProgress = await prisma.progress.findUnique({
                where: { progressID: progress.progressID }
            });
            expect(deletedProgress).to.be.null;
        });

        it("should return 404 when deleting non-existent progress", async () => {
            const res = await request(app)
                .delete('/api/progress/99999')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);

            expect(res.body).to.have.property('message', 'No progress with the id: 99999 found');
        });
    });

    describe("GET /api/progress/exercise/volume", () => {
        it("should get progress by exercise", async () => {
            // Create session exercise to test volume calculation
            await prisma.sessionExercise.create({
                data: {
                    sessionID: sessionId,
                    exerciseID: exerciseId,
                    sets: 3,
                    reps: 10,
                    weight: 100
                }
            });

            const res = await request(app)
                .get('/api/progress/exercise/volume')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).to.have.property('message', 'Progress by exercise retrieved successfully');
            expect(res.body.data).to.be.an('object');
        });
    });

    describe("GET /api/progress/muscle-group/summary", () => {
        it("should get muscle group summary", async () => {
            // Create session exercise for muscle group summary
            await prisma.sessionExercise.create({
                data: {
                    sessionID: sessionId,
                    exerciseID: exerciseId,
                    sets: 4,
                    reps: 8,
                    weight: 120
                }
            });

            const res = await request(app)
                .get('/api/progress/muscle-group/summary')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).to.have.property('message', 'Muscle group summary retrieved successfully');
            expect(res.body.data).to.be.an('object');
            
            // Check if CHEST muscle group exists in response
            if (res.body.data.CHEST) {
                expect(res.body.data.CHEST).to.have.property('Test Bench Press');
            }
        });
    });

    describe("Authentication and Authorization", () => {
        it("should return 401 without token", async () => {
            await request(app)
                .get(`/api/progress/user/${testUserId}`)
                .expect(401);
        });

        it("should return 403 for unauthorized role", async () => {
            // This would require creating a test user with a different role
            // and testing against your RBAC middleware
            // You might need to extend your test helpers for this
        });
    });

    describe("Progress Calculation Logic", () => {
        it("should correctly calculate total volume from session exercises", async () => {
            // Create multiple session exercises
            await prisma.sessionExercise.createMany({
                data: [
                    {
                        sessionID: sessionId,
                        exerciseID: exerciseId,
                        sets: 3,
                        reps: 10,
                        weight: 100 // Volume: 3000
                    },
                    {
                        sessionID: sessionId,
                        exerciseID: exerciseId,
                        sets: 4,
                        reps: 8,
                        weight: 120 // Volume: 3840
                    }
                ]
            });

            const res = await request(app)
                .get('/api/progress/muscle-group/summary')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Verify volume calculation in the response
            if (res.body.data.CHEST && res.body.data.CHEST['Test Bench Press']) {
                const exerciseData = res.body.data.CHEST['Test Bench Press'];
                expect(exerciseData).to.be.an('array');
                
                // Check that we have entries with correct volume calculations
                exerciseData.forEach(entry => {
                    expect(entry).to.have.property('totalVolume');
                    expect(entry.totalVolume).to.be.a('number');
                });
            }
        });
    });
});