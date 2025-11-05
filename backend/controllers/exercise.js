import exerciseRepository from "../repositories/exercise.js";

const createExercise = async (req, res) => {
    try {
        const existingExercise = await exerciseRepository.findByName(req.body.name);
        if (existingExercise) {
            return res.status(400).json({
                message: `Exercise with the name: ${req.body.name} already exists`,
            });
        }
        const newExercise = await exerciseRepository.create(req.body);
        return res.status(201).json({
            message: "Exercise created successfully",
            data: newExercise,
        });
    }   catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

const getAllExercises = async (req, res) => {
    try {
        const {
            name,
            muscleGroup,
            sortBy = 'exerciseID',
            sortOrder = 'asc',
            page = 1,
            pageSize = 10
        } = req.query;

        const filters = {};
        if (name) filters.name = name;
        if (muscleGroup) filters.muscleGroup = muscleGroup;

        const validSortOrders = ['asc', 'desc'];
        const order = validSortOrders.includes(sortOrder.toLowerCase())
            ? sortOrder.toLowerCase()
            : 'asc';

        const validSortFields = ['exerciseID', 'name', 'muscleGroup'];
        const sortField = validSortFields.includes(sortBy)
            ? sortBy
            : 'exerciseID';

        const exercises = await exerciseRepository.findAll(
            filters,
            sortField,
            order,
            page,
            pageSize
        );

        if (!exercises.data || exercises.data.length === 0) {
            return res.status(404).json({ message: "No exercises found" });
        }

        return res.status(200).json({
            message: "Exercises retrieved successfully",
            data: exercises.data,
            pagination: exercises.pagination
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getExerciseById = async (req, res) => {   
    try {
        const exercise = await exerciseRepository.findById(req.params.exerciseID);
        if (!exercise) {
            return res.status(404).json({ message: `Exercise with ID ${req.params.exerciseID} not found` });
        }
        return res.status(200).json({
            message: "Exercise retrieved successfully",
            data: exercise,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

const updateExercise = async (req, res) => {
    try{
        const existingExercise = await exerciseRepository.findById(req.params.exerciseID);
        if (!existingExercise) {
            return res.status(404).json({
                 message: `Exercise with ID ${req.params.exerciseID} not found` 
                });
        }
        const updatedExercise = await exerciseRepository.update(req.params.exerciseID, req.body)
        return res.status(200).json({
            message: "Exercise updated successfully",
            data: updatedExercise,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

    const deleteExercise = async (req, res) => {
        try {
            const existingExercise = await exerciseRepository.findById(req.params.exerciseID);
            if (!existingExercise) {
                return res.status(404).json({
                    message: `Exercise with ID ${req.params.exerciseID} not found`
                });
            }
            await exerciseRepository.delete(req.params.exerciseID);
            return res.status(200).json({
                message: "Exercise deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

export {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
};