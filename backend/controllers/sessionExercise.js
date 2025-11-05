import sessionExerciseRepository from "../repositories/sessionExercise.js";

const createSessionExercise = async (req, res) => {
    try {
        const { sets, reps, weight, sessionID, exerciseID } = req.body;

        // Validate required fields
        if (!sessionID || !exerciseID) {
            return res.status(400).json({
                message: "sessionID and exerciseID are required"
            });
        }

        // Check if session exists
        const sessionExists = await sessionExerciseRepository.sessionExists(sessionID);
        if (!sessionExists) {
            return res.status(404).json({
                message: `WorkoutSession with ID ${sessionID} not found`
            });
        }

        // Check if exercise exists
        const exerciseExists = await sessionExerciseRepository.exerciseExists(exerciseID);
        if (!exerciseExists) {
            return res.status(404).json({
                message: `Exercise with ID ${exerciseID} not found`
            });
        }

        const sessionExerciseData = {
            sets: sets || 0,
            reps: reps || 0,
            weight: weight || 0,
            sessionID: Number(sessionID), // Direct assignment instead of nested connect
            exerciseID: Number(exerciseID) // Direct assignment instead of nested connect
        };

        const sessionExercise = await sessionExerciseRepository.create(sessionExerciseData);
        return res.status(201).json({
            message: "Session-Exercise created successfully",
            data: sessionExercise,
        });
    } catch (error) {
        console.error("Error creating session exercise:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}

const getSessionExercisesBySessionId = async (req, res) => {
    try {
        const sessionExercises = await sessionExerciseRepository.findBySessionId(req.params.sessionID);
        
        if (!sessionExercises || sessionExercises.length === 0) {
            return res.status(404).json({
                message: `No session exercises found for session ID: ${req.params.sessionID}`
            });
        }

        return res.status(200).json({
            message: "Session exercises retrieved successfully",
            data: sessionExercises,
        });
    } catch (error) {
        console.error("Error fetching session exercises:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}

const deleteSessionExercise = async (req, res) => {
    try {
        const existingSessionExercise = await sessionExerciseRepository.findById(req.params.id);
        if (!existingSessionExercise) {
            return res.status(404).json({
                message: `No session exercise with the id: ${req.params.id} found`
            });
        }
        await sessionExerciseRepository.deleteSessionExercise(req.params.id);
        return res.status(200).json({
            message: "Session exercise deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting session exercise:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}

const updateSessionExercise = async (req, res) => {
    try {
        const existingSessionExercise = await sessionExerciseRepository.findById(req.params.id);
        if (!existingSessionExercise) {
            return res.status(404).json({
                message: `No session exercise with the id: ${req.params.id} found`
            });
        }

        // If updating sessionID or exerciseID, validate they exist
        if (req.body.sessionID) {
            const sessionExists = await sessionExerciseRepository.sessionExists(req.body.sessionID);
            if (!sessionExists) {
                return res.status(404).json({
                    message: `WorkoutSession with ID ${req.body.sessionID} not found`
                });
            }
        }

        if (req.body.exerciseID) {
            const exerciseExists = await sessionExerciseRepository.exerciseExists(req.body.exerciseID);
            if (!exerciseExists) {
                return res.status(404).json({
                    message: `Exercise with ID ${req.body.exerciseID} not found`
                });
            }
        }

        const updatedSessionExercise = await sessionExerciseRepository.updateSessionExercise(req.params.id, req.body);
        return res.status(200).json({
            message: "Session exercise updated successfully",
            data: updatedSessionExercise,
        });
    } catch (error) {
        console.error("Error updating session exercise:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export {
    createSessionExercise,
    getSessionExercisesBySessionId,
    deleteSessionExercise,
    updateSessionExercise,
};