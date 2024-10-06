import { Router } from 'express';

import {registerUser, updateUserProfile} from "../controllers/user.controller";

const router = Router();

router.post('/register', registerUser);
// router.post('/login', loginUser);
router.post('/update', updateUserProfile);

export default router;