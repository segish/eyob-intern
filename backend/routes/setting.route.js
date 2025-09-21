import express from "express";
import { protectRoute, roleRoute } from "../middleware/auth.middleware.js";
import { getInformations, updateSetting } from "../controllres/setting.controllers.js";


const router = express.Router();

router.post("/update",protectRoute,roleRoute(["admin"]),updateSetting);
router.get("/",getInformations);

export default router;
