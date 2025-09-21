import express from "express";
import { protectRoute, roleRoute } from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllres/analytics.controllers.js";


const router = express.Router();
router.get("/",protectRoute,roleRoute(["admin"]),getAnalytics);

export default router;