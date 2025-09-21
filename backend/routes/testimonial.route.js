import express from 'express';
import { protectRoute, roleRoute } from '../middleware/auth.middleware.js';
import { createTestimonial, deleteTestimonial, editTestimonial, getAllTestimonials, searchTestimonial } from '../controllres/testimonial.controllres.js';


const router = express.Router();

router.post("/creste",protectRoute,roleRoute(["admin","testimonialManager"]),createTestimonial);

router.post("/search",protectRoute,roleRoute(["admin","testimonialManager"]),searchTestimonial);

router.get("/",protectRoute,roleRoute(["admin","testimonialManager"]),getAllTestimonials);
router.patch("/edit/:id",protectRoute,roleRoute(["admin","testimonialManager"]),editTestimonial);
router.delete("/delete/:id",protectRoute,roleRoute(["admin","testimonialManager"]),deleteTestimonial);


export default router;