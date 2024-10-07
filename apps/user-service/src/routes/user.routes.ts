import { Router } from 'express';

import {allUsers, getUser, registerUser, updateUserProfile} from "../controllers/user.controller";

const router = Router();

router.post('/register', registerUser);
// router.post('/login', loginUser);
router.put('/update', updateUserProfile);
router.get('/', allUsers);
router.get('/:id', getUser);

export default router;