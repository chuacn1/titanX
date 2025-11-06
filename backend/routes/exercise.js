import express from 'express';

import {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
} from '../controllers/exercise.js';

import {
    validatePostExercise,
    validatePutExercise
} from '../middleware/validation/exercise.js';

const router = express.Router();

import rbac from '../middleware/rbac.js';
import jwtAuth from '../middleware/jwtAuth.js';

router.post('/', validatePostExercise, jwtAuth, rbac("ADMIN","NORMAL"), createExercise);
router.get('/', jwtAuth, rbac("ADMIN", "NORMAL"), getAllExercises);
router.get('/:exerciseID', jwtAuth, rbac("ADMIN", "NORMAL"), getExerciseById);
router.put('/:exerciseID', validatePutExercise, jwtAuth, rbac("ADMIN"), updateExercise);
router.delete('/:exerciseID', jwtAuth, rbac("ADMIN"), deleteExercise);

export default router;