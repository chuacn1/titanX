import prisma from "../prisma/client.js";

class progressRepository {
    async create(data) {
        return await prisma.progress.create({
            data,
        });
    }

    async getProgressById(progressID) {
        return await prisma.progress.findUnique({
            where: { progressID: Number(progressID) },
        });
    }

    async updateProgress(progressID, data) {
        return await prisma.progress.update({
            where: { progressID: Number(progressID) },
            data,
        });
    }

    async updateProgressByUserId(userId, data) {
        // Find the progress record for this user and update it
        const progress = await prisma.progress.findFirst({
            where: { id: userId }
        });
        
        if (!progress) {
            return null;
        }
        
        return await prisma.progress.update({
            where: { progressID: progress.progressID },
            data,
        });
    }

    async deleteProgress(progressID) {
        return await prisma.progress.delete({
            where: { progressID: Number(progressID) },
        });
    }

    async getProgressByUserId(userId) {
        return await prisma.progress.findMany({
            where: { id: userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async calculateVolumeByExercise(userId) {
        // Fetch all session exercises for the user's workout sessions
        const sessionExercises = await prisma.sessionExercise.findMany({
            where: {
                workoutSession: {
                    user: {  // Fixed: filter by user ID through the relationship
                        id: userId
                    }
                }
            },
            // Include related exercise and session details
            include: {
                exercise: {
                    select: {
                        exerciseID: true,
                        name: true,
                        muscleGroup: true
                    }
                },
                // Include session date for grouping
                workoutSession: {
                    select: {
                        createdAt: true,
                        sessionID: true,
                        notes: true,
                        id: true
                    }
                }
            },
            orderBy: {
                workoutSession: {
                    createdAt: 'asc'
                }
            }
        });
    
        console.log('Found session exercises:', sessionExercises.length);
        // Log each session exercise for debugging
        sessionExercises.forEach(se => {
            console.log(`- ${se.exercise.name} (${se.exercise.muscleGroup}): ${se.sets}x${se.reps}x${se.weight} on ${se.workoutSession.createdAt}`);
            if (se.workoutSession.notes) {
                console.log(`  Notes: ${se.workoutSession.notes}`);
            }
        });
    
        // Group by muscle group, then by exercise with date entries
        const summary = sessionExercises.reduce((acc, sessionExercise) => {
            const muscleGroup = sessionExercise.exercise.muscleGroup;
            const exerciseName = sessionExercise.exercise.name;
            const date = sessionExercise.workoutSession.createdAt.toLocaleDateString('en-CA');
            const volume = sessionExercise.sets * sessionExercise.reps * sessionExercise.weight;
            const totalReps = sessionExercise.sets * sessionExercise.reps;
            const maxWeight = sessionExercise.weight;
            const notes = sessionExercise.workoutSession.notes; 
    
            // Initialize muscle group if not exists
            if (!acc[muscleGroup]) {
                acc[muscleGroup] = {};
            }
    
            // Initialize exercise if not exists
            if (!acc[muscleGroup][exerciseName]) {
                acc[muscleGroup][exerciseName] = [];
            }
    
            // Add each workout session as a separate entry with notes
            acc[muscleGroup][exerciseName].push({
                date: date,
                totalVolume: volume,
                totalReps: totalReps,
                maxWeight: maxWeight,
                sets: sessionExercise.sets,
                notes: notes || null,
                sessionID: sessionExercise.workoutSession.sessionID 
            });
    
            return acc;
        }, {});
    
        return summary;
    }

    // Optional: Get progress with pagination and filtering
    async findAll(
        filters = {},
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        pageSize = 10
    ) {
        page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

        const query = {
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {},
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        };

        // Add dynamic filtering
        if (Object.keys(filters).length > 0) {
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

        const totalCount = await prisma.progress.count({
            where: query.where,
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        const progresses = await prisma.progress.findMany(query);

        return {
            data: progresses,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages,
            },
        };
    }

}

export default new progressRepository();