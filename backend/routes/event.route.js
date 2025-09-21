import express from "express";


import { createEvent, deleteEvent, editEvent, getAllEvents, searchEvent } from "../controllres/event.controllers.js";
import { protectRoute, roleRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/create", protectRoute, roleRoute(["admin", "socialManager"]), createEvent);
router.post("/search", protectRoute, roleRoute(["admin", "socialManager"]), searchEvent);
router.get("/", protectRoute, roleRoute(["admin"]), getAllEvents);
router.patch("/edit/:id", protectRoute, roleRoute(["admin", "socialManager"]), editEvent);
router.delete("/delete/:id", protectRoute, roleRoute(["admin", "socialManager"]), deleteEvent);





export default router;