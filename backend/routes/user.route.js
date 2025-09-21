import express from 'express';
import { createUser, deleteUserProfile, editUserProfile, getAllUsers, searchUser } from '../controllres/user.controllers.js';
import { protectRoute, roleRoute } from '../middleware/auth.middleware.js';



const router = express.Router();



router.get("/getallusers",protectRoute,roleRoute(["admin"]),getAllUsers)

router.post("/create",protectRoute,roleRoute(["admin"]),createUser);
router.post("/search",protectRoute,roleRoute(["admin"]),searchUser);

router.patch("/edit/:id",protectRoute,roleRoute(["admin"]),editUserProfile);
router.delete("/delete/:id",protectRoute,roleRoute(["admin"]),deleteUserProfile);

export default router;