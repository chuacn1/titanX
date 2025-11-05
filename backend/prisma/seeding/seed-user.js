import prisma from "../client.js";

import { validatePostUser } from "../../middleware/validation/user.js";

const validateUser = (user) => {
    const req = { body: user };
    const res = {
        status: (code) => ({
            json: (message) => {
                console.log(message);
                process.exit(1);
            },
        }),
    };

    validatePostUser(req, res, () => {});
}

const seedUsers = async () => {
    try {
        await prisma.user.deleteMany();

        const userData =[
            {
              "username": "johndoe123",
              "email": "john.doe@example.com",
              "password": "SecurePass123!",
              "age": "28",
              "role": "NORMAL"
            },
            {
              "username": "sarahsmith",
              "email": "sarah.smith@example.com",
              "password": "Sarah123$",
              "age": "32",
              "role": "ADMIN"
            },
            {
              "username": "mikejohnson24",
             "email": "mike.johnson@example.com",
              "password": "MikePass123!",
              "age": "24",
              "role": "NORMAL"
            },
            {
              "username": "lisawilliams45",
              "email": "lisa.williams@example.com",
              "password": "Lisa@4567",
              "age": "45",
              "role": "NORMAL"
            },
            {
              "username": "robertdavis67",
              "email": "robert.davis@example.com",
              "password": "Robert67!",
              "age": "67",
              "role": "ADMIN"
            },
            {
              "username": "sarahconnor",
              "email": "Sarah.Conner@Example.com",
              "password": "Terminator123!",
              "age": "35",
              "role": "NORMAL"
            }
          ]
              
            const data = await Promise.all(
                userData.map(async (user) => {
                    validateUser(user);
                    return { ...user }
                })
            );
        await prisma.user.createMany({ 
            data,
        skipDuplicates: true,
    });
        console.log("User data seeded successfully.");
    } catch (error) {
        console.error("Error seeding user data:", error);
    }
};

seedUsers(); 