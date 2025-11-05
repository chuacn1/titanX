import progressRepository from "../repositories/progress.js";

const createProgress = async (req, res) => {
    try {
        const progressData = {
            ...req.body,
            id: req.user.id, // Associate progress with the authenticated user
        };
        const progress = await progressRepository.create(progressData);
        return res.status(201).json({
            message: "Progress created successfully",
            data: progress,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getTheProgressByUserId = async (req, res) => {
    try {
        const progress = await progressRepository.getProgressByUserId(req.params.userId);
        return res.status(200).json({
            message: "Progress retrieved successfully",
            data: progress,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const updateProgress = async (req, res) => {
    try {
        const existingProgress = await progressRepository.getProgressById(req.params.id);
        if (!existingProgress) {
            return res.status(404).json({
                message: `No progress with the id: ${req.params.id} found`
            });
        }
        
        // Recalculate total volume if needed, or use provided data
        const updateData = req.body;
        if (!updateData.totalVolume) {
            updateData.totalVolume = await progressRepository.calculateTotalVolume(existingProgress.id);
        }
        
        const updatedProgress = await progressRepository.updateProgress(req.params.id, updateData);
        return res.status(200).json({
            message: "Progress updated successfully",
            data: updatedProgress,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const deleteProgress = async (req, res) => {
    try {
        const existingProgress = await progressRepository.getProgressById(req.params.id);
        if (!existingProgress) {
            return res.status(404).json({
                message: `No progress with the id: ${req.params.id} found`
            });
        }
        await progressRepository.deleteProgress(req.params.id);
        return res.status(200).json({
            message: "Progress deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getProgressById = async (req, res) => {
    try {
        const progress = await progressRepository.getProgressById(req.params.id);
        if (!progress) {
            return res.status(404).json({
                message: `No progress with the id: ${req.params.id} found`
            });
        }
        return res.status(200).json({
            message: "Progress retrieved successfully",
            data: progress,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getProgressByExercise = async (req, res) => {
    try {
        const volumeByExercise = await progressRepository.calculateVolumeByExercise(req.user.id);
        
        return res.status(200).json({
            message: "Progress by exercise retrieved successfully",
            data: volumeByExercise,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getMuscleGroupSummary = async (req, res) => {
    try {
        const summaryData = await progressRepository.calculateVolumeByExercise(req.user.id);
        
        // Debug: log what exercises are being found
        console.log('User ID:', req.user.id);
        console.log('Summary data keys:', Object.keys(summaryData));
        Object.keys(summaryData).forEach(muscleGroup => {
            console.log(`${muscleGroup}:`, Object.keys(summaryData[muscleGroup]));
        });
        
        return res.status(200).json({
            message: "Muscle group summary retrieved successfully",
            data: summaryData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
export {
    createProgress,
    getTheProgressByUserId,
    updateProgress,
    deleteProgress,
    getProgressById,
    getProgressByExercise,
    getMuscleGroupSummary
};