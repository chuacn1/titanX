import prisma from "../prisma/client.js";

class exerciseRepository {
    async create(data) {
        return await prisma.exercise.create({
            data,
        });
    }

    async findAll(
        filters = {},
        sortBy = "exerciseID",
        sortOrder = "asc",
        page = 1,
        pageSize = 10
    ) {
        // Ensure the page and page size are positive integers
        page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
    
        const query = {
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {}  // Initialize where clause
        };
    
        // Add dynamic filtering conditions if filters are provided
        if (Object.keys(filters).length > 0) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null && value !== "") {
                    if (key === 'muscleGroup') {
                        // Handle enum field - use equals for exact match
                        query.where[key] = { equals: value };
                    } else if (typeof value === "string") {
                        // Handle string fields like 'name'
                        query.where[key] = { contains: value, mode: "insensitive" };
                    } else if (typeof value === "boolean") {
                        query.where[key] = { equals: value };
                    } else if (typeof value === "number") {
                        query.where[key] = { equals: value };
                    }
                }
            }
        }
    
        // Get total count with the same filters
        const totalCount = await prisma.exercise.count({
            where: query.where,
        });
    
        // Calculate total number of pages
        const totalPages = Math.ceil(totalCount / pageSize);
    
        const exercises = await prisma.exercise.findMany(query);
    
        // Return the data along with pagination information
        return {
            data: exercises,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages,
            },
        };
    }

    async findById(exerciseID) {
        return await prisma.exercise.findUnique({
            where: { exerciseID:Number(exerciseID) },
        });
    }

    async findByName(name) {
        return await prisma.exercise.findFirst({
            where: { name },
        });
    }

    async update(exerciseID, data) {
        return await prisma.exercise.update({
            where: { exerciseID:Number(exerciseID) },
            data,
        });
    }

    async delete(exerciseID) {
        return await prisma.exercise.delete({
            where: { exerciseID:Number(exerciseID) },
        });
    }
}

export default new exerciseRepository();