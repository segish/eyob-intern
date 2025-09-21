import express from "express";
import { protectRoute, roleRoute } from "../middleware/auth.middleware.js";
import { createPartner, deletePartner, editPartner, getAllPartner, searchPartner } from "../controllres/partner.controller.js";


const router = express.Router();


router.get("/",getAllPartner);

router.post("/create",protectRoute,roleRoute(["admin"]),createPartner);
router.post("/search",protectRoute,roleRoute(["admin"]),searchPartner);

router.patch("/edit/:id",protectRoute,roleRoute(["admin"]),editPartner);

router.delete("/delete/:id",protectRoute,roleRoute(["admin"]),deletePartner);


export default router;