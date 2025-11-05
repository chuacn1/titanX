import express from 'express'; 

import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser
} from '../controllers/user.js';

import {
    validatePostUser,
    validatePutUser
} from '../middleware/validation/user.js';

import rbac from '../middleware/rbac.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = express.Router();

router.get('/me', jwtAuth, getCurrentUser);
router.post('/', validatePostUser, jwtAuth, rbac("ADMIN"), createUser);
router.get('/', jwtAuth, rbac("ADMIN"), getAllUsers);
router.get('/:id', jwtAuth, rbac("ADMIN", "NORMAL"), getUserById);
router.put('/:id', validatePutUser, jwtAuth, rbac("ADMIN", "NORMAL"), updateUser);
router.delete('/:id', jwtAuth, rbac("ADMIN"), deleteUser);

export default router;