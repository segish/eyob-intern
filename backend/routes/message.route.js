import express from "express";
import { protectRoute, roleRoute } from "../middleware/auth.middleware.js";
import { deleteMessage, getAllmessages, searchMessage, sendMessage } from "../controllres/message.controller.js";


const router = express.Router();


router.get("/",protectRoute,roleRoute(["admin"],getAllmessages));

router.post("/send-message",sendMessage);
router.post("search-message",protectRoute,roleRoute(["admin"]),searchMessage);

router.delete("/delete-message/:id",protectRoute,roleRoute(["admin"]),deleteMessage);






export default router;