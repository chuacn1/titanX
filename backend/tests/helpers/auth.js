import request from "supertest";
import app from "../../app.js";
import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";

export const setupTestAuth = async () => {
  // Clean up first
  await prisma.user.deleteMany();

  // Hash the password properly
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create user with properly hashed password
  const testUser = await prisma.user.create({
    data: {
      id: "test-admin-id-123", 
      username: "testadmin",
      email: "admin@test.com",
      password: hashedPassword, // Store hashed password
      age: "30",
      role: "ADMIN"
    }
  });

  console.log("Test user created with hashed password");

  // Now login via API to get a valid token
  const res = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "password123", // Send plain text, your login should hash and compare
  });

  console.log("Login response status:", res.status);
  console.log("Login response body:", res.body);
  
  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.body.message}`);
  }
  
  return res.body.token;
};

export const cleanupDatabase = async () => {
  await prisma.user.deleteMany();
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};