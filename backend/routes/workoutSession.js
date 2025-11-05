import express from 'express';

import {
    createWorkoutSession,
    getAllWorkoutSessions,
    getWorkoutSessionsByUserId,
    updateWorkoutSession,
    deleteWorkoutSession
} from '../controllers/workoutSession.js';

import {
    validatePostWorkoutSession, 
    validatePutWorkoutSession
} from '../middleware/validation/workoutSession.js';

import rbac from '../middleware/rbac.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = express.Router();

router.post('/', validatePostWorkoutSession, jwtAuth, rbac("NORMAL", "ADMIN"), createWorkoutSession);
router.get('/', jwtAuth, rbac("ADMIN"), getAllWorkoutSessions);
router.get('/my-notes', jwtAuth, rbac("NORMAL", "ADMIN"), getWorkoutSessionsByUserId);
router.put('/:id', validatePutWorkoutSession, jwtAuth, rbac("NORMAL", "ADMIN"), updateWorkoutSession);
router.delete('/:id', jwtAuth, rbac("NORMAL", "ADMIN"), deleteWorkoutSession);

export default router;