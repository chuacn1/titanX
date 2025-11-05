import workoutSessionRepository from "../repositories/workoutSession.js";

const createWorkoutSession = async (req, res) => {
    try {
        const userId = req.user.userID || req.user.id;
        
        console.log('👤 Creating session for user:', userId);
        
        const workoutSessionData = {
            notes: req.body.notes,
            id: userId  // Directly set the id field for the relationship
        };

        const workoutSession = await workoutSessionRepository.create(workoutSessionData);
        return res.status(201).json({
            message: "Workout session created successfully",
            data: workoutSession,
        });
    } catch (error) {
        console.log('❌ Error creating workout session:', error);
        return res.status(500).json({
            message: error.message
        });
    }
}

const getAllWorkoutSessions = async (req, res) => {
    try {
        const workoutSessions = await workoutSessionRepository.findAll(
            req.query.filters ? JSON.parse(req.query.filters) : {},
            req.query.sortBy,
            req.query.sortOrder,
            req.query.page,
            req.query.pageSize
        );
        return res.status(200).json({
            message: "Workout sessions retrieved successfully",
            data: workoutSessions.data,
            pagination: workoutSessions.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


const getWorkoutSessionsByUserId = async (req, res) => {
    try {

        // Get user ID from JWT
        const userId = req.user.id;

        console.log('🎯 Using userID:', userId);
        console.log('🔍 userID type:', typeof userId);
        
        if (!userId) {
            console.log('No user ID found in JWT token');
            return res.status(401).json({
                message: "User not authenticated - no user ID in token"
            });
        }

        const workoutSessions = await workoutSessionRepository.getOneUserWorkoutSessions(userId);
        
        return res.status(200).json({
            message: "Workout sessions retrieved successfully",
            data: workoutSessions,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


const deleteWorkoutSession = async (req, res) => {
    try {
        const existingWorkoutSession = await workoutSessionRepository.deleteWorkoutSession(req.params.id);
        if (!existingWorkoutSession) {
            return res.status(404).json({
                message: `No workout session with the id: ${req.params.id} found`
            });
        }
        await workoutSessionRepository.deleteWorkoutSession(req.params.id);
        return res.status(200).json({
            message: "Workout session deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const updateWorkoutSession = async (req, res) => {
    try {
        const existingWorkoutSession = await workoutSessionRepository.retrievesAsessionByID(req.params.id);
        if (!existingWorkoutSession) {
            return res.status(404).json({
                message: `No workout session with the id: ${req.params.id} found`
            });
        }
        const updatedWorkoutSession = await workoutSessionRepository.updateWorkoutSession(req.params.id, req.body);
        return res.status(200).json({
            message: "Workout session updated successfully",
            data: updatedWorkoutSession,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export {
    createWorkoutSession,
    getAllWorkoutSessions,
    getWorkoutSessionsByUserId,
    updateWorkoutSession,
    deleteWorkoutSession

};

