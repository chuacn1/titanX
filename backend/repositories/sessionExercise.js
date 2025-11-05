import prisma from "../prisma/client.js";

class sessionExerciseRepository {
    async create(data) {
        return await prisma.sessionExercise.create({
            data,
        });
    }
    
    async findAll( 
        filters = {},
        sortBy = "sessionExerciseID",
        sortOrder = "asc",
        page = 1,
        pageSize = 10
    ) {
        page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    
        const query = {
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {}
        };
    
        if (Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null && value !== "") {
                    if (typeof value === "string") {
                        query.where[key] = { contains: value, mode: "insensitive" };
                    } else if (typeof value === "boolean" || typeof value === "number") {
                        query.where[key] = { equals: value };
                    }
                }
            }
        }
    
        const totalCount = await prisma.sessionExercise.count({
            where: query.where,
        });
    
        const totalPages = Math.ceil(totalCount / pageSize);
    
        const sessionExercises = await prisma.sessionExercise.findMany(query);
    
        return {
            data: sessionExercises,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages,
            },
        };
    }

    async updateSessionExercise(sessionExerciseID, data) {
        return await prisma.sessionExercise.update({
            where: { sessionExerciseID: Number(sessionExerciseID) },
            data,
        });
    }

    async deleteSessionExercise(sessionExerciseID) {
        return await prisma.sessionExercise.delete({
            where: { sessionExerciseID: Number(sessionExerciseID) },
        });
    }

    async findById(sessionExerciseID) {
        return await prisma.sessionExercise.findUnique({
            where: { sessionExerciseID: Number(sessionExerciseID) },
        });
    }


    async findBySessionId(sessionID) {
        return await prisma.sessionExercise.findMany({
            where: { 
                sessionID: Number(sessionID) 
            },
            include: {
                exercise: true, // Include exercise details
                workoutSession: true // Include session 
            }
        });
    }

    async sessionExists(sessionID) {
        const session = await prisma.workoutSession.findUnique({
            where: { sessionID: Number(sessionID) }
        });
        return !!session;   //returns true if session exists, false otherwise
    }

    async exerciseExists(exerciseID) {
        const exercise = await prisma.exercise.findUnique({
            where: { exerciseID: Number(exerciseID) }
        });
        return !!exercise;
    }
}

export default new sessionExerciseRepository();