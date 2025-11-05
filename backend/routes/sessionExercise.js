import express from 'express';

import {
    createSessionExercise,
    getSessionExercisesBySessionId,
    deleteSessionExercise,
    updateSessionExercise,
} from '../controllers/sessionExercise.js';

import {    
    validatePostsessionExercise,
    validatePutsessionExercise
} from '../middleware/validation/sessionExercise.js';

const router = express.Router();

import rbac from '../middleware/rbac.js';
import jwtAuth from '../middleware/jwtAuth.js';

router.post('/', validatePostsessionExercise, jwtAuth, rbac("ADMIN", "NORMAL"), createSessionExercise);
router.get('/:sessionID', jwtAuth, rbac("ADMIN", "NORMAL"), getSessionExercisesBySessionId);
router.put('/:id', validatePutsessionExercise, jwtAuth, rbac("ADMIN", "NORMAL"), updateSessionExercise);
router.delete('/:id', jwtAuth, rbac("ADMIN", "NORMAL"), deleteSessionExercise);


export default router;
