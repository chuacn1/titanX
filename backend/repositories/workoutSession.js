import prisma from "../prisma/client.js";

class workoutSessionRepository {
    async create(data) {
        return await prisma.workoutSession.create({
            data,
        });
    }

    async findAll(
        filters = {},
        sortBy = "sessionID",
        sortOrder = "asc",
        page = 1,
        pageSize = 10
    ) {
        // Ensure the page and page size are positive integers
        page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

        // Get total number of WORKOUTSESSION records that match the filters
        const totalCount = await prisma.workoutSession.count({
            where: filters,
        });

        // Calculate total number of pages
        const totalPages = Math.ceil(totalCount / pageSize);

        const query = {
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * pageSize,
            take: pageSize,
        };

        // Add dynamic filtering conditions if filters are provided
        if (Object.keys(filters).length > 0) {
            query.where = {};

            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null && value !== "") {
                    if (typeof value === "string") {
                        query.where[key] = { contains: value, mode: "insensitive" };
                    } else if (typeof value === "boolean") {
                        query.where[key] = { equals: value };
                    } else if (typeof value === "number") {
                        query.where[key] = { equals: value };
                    }
                }
            }
        }

        const workoutSessions = await prisma.workoutSession.findMany(query);

        // Return the data along with pagination information
        return {
            data: workoutSessions,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages,
            },
        };
    }

    async getALLWorkoutSessions() {
        return await prisma.workoutSession.findMany();
    }

    async retrievesAsessionByID(sessionID) {
        return await prisma.workoutSession.findUnique({
            where: { sessionID: Number(sessionID) },
        });
    }

    async getOneUserWorkoutSessions(userID) {
        return await prisma.workoutSession.findMany({
            where: { id: userID },
        });
    }

    async updateWorkoutSession(sessionID, data) {
        return await prisma.workoutSession.update({
            where: { sessionID: Number(sessionID) },
            data,
        });
    }

    async deleteWorkoutSession(sessionID) {
        return await prisma.workoutSession.delete({
            where: { sessionID },
        });
    }
}

export default new workoutSessionRepository();