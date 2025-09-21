import express from 'express';

import { createCategory, createProduct, deleteCategory, deleteProduct, editCategory, editProduct, getAllProducts ,getCategory,getFeaturedProduct, getProductByCatagory, searchProduct, toggleFeaturedProduct} from '../controllres/product.controllers.js';
import {  protectRoute, roleRoute } from '../middleware/auth.middleware.js';


const router = express.Router();



router.get("/",protectRoute,roleRoute(["admin","productManager"]),getAllProducts);
router.get("/featured",getFeaturedProduct);
router.get("/catagory/bycategory/:categroy",getProductByCatagory);

router.patch("/:id",protectRoute,roleRoute(["admin","productManager"]),toggleFeaturedProduct);

router.post("/create",protectRoute,roleRoute(["admin","productManager"]),createProduct);
router.post("/search",protectRoute,roleRoute(["admin","productManager"]),searchProduct);
router.post("/edit/:id",protectRoute,roleRoute(["admin","productManager"]),editProduct);

router.delete("/:id",protectRoute,roleRoute(["admin","productManager"]),deleteProduct);

router.post("/catagory/createCatagory",protectRoute,roleRoute(["admin","productManager"]),createCategory);
router.post("/catagory/editCatagory/:id",protectRoute,roleRoute(["admin","productManager"]),editCategory);
router.delete("/catagory/deleteCatagory/:id",protectRoute,roleRoute(["admin","productManager"]),deleteCategory);
router.get("/catagory/getCatagory",protectRoute,roleRoute(["admin","productManager"]),getCategory);



export default router;