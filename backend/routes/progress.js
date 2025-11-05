import express from 'express';

import {
    createProgress,
    getTheProgressByUserId,
    updateProgress,
    deleteProgress,
    getProgressById,
    getProgressByExercise,
    getMuscleGroupSummary
} from '../controllers/progress.js';

import {
    validatePostProgress,
    validatePutProgress
} from '../middleware/validation/progress.js';

import rbac from '../middleware/rbac.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = express.Router();

router.post('/', validatePostProgress, jwtAuth, rbac("NORMAL", "ADMIN"), createProgress);
router.get('/:id', jwtAuth, rbac("NORMAL", "ADMIN"), getProgressById);
router.get('/user/:userId', jwtAuth, rbac("NORMAL", "ADMIN"),     getTheProgressByUserId);
router.put('/:id', validatePutProgress, jwtAuth, rbac("NORMAL", "ADMIN"), updateProgress);
router.delete('/:id', jwtAuth, rbac("NORMAL", "ADMIN"), deleteProgress);
router.get('/muscle-group/summary', jwtAuth, rbac("NORMAL", "ADMIN"), getMuscleGroupSummary);
router.get('/exercise/volume', jwtAuth, rbac("NORMAL", "ADMIN"), getProgressByExercise);

export default router;