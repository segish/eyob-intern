import express from 'express';
import { getProfile, login, logout ,refreshToken} from '../controllres/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();



router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get("/profile", protectRoute, getProfile);


export default router;