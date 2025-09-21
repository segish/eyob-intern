import express from 'express';

import { createService, deleteService, editService, getAllServices, searchService } from '../controllres/service.controllers.js';
import {  protectRoute, roleRoute } from '../middleware/auth.middleware.js';


const router = express.Router();


router.post("/create",protectRoute,roleRoute(["admin","serviceManager"]),createService);
router.post("/search",protectRoute,roleRoute(["admin","serviceManager"]),searchService);

router.get("/",protectRoute,roleRoute(["admin","serviceManager"]),getAllServices);

router.patch("/edit/:id",protectRoute,roleRoute(["admin","serviceManager"]),editService);

router.delete("/delete/:id",protectRoute,roleRoute(["admin","serviceManager"]),deleteService);

export default router;