import Product from "../model/product.model.js";
import Catagory from "../model/catagory.model.js";

import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("catagory_id","name -_id");
    res.status(200).json({products});
  } catch (error) {
    console.log("error in getAllProducts controller", error);
    res.status(500).json({message:"Server error", error: error.message});
  }
}
export const getFeaturedProduct = async (req, res) => {
  try {
    let featuredProduct = redis.get("featured_product");
    if(featuredProduct){
      console.log("featured product from cache");
      return res.status(200).json(JSON.parse(featuredProduct));
    }

    featuredProduct = await Product.find({isFeatured:true}).populate("catagory_id","name -_id").lean();

    await redis.set("featured_product",JSON.stringify(featuredProduct));

    res.status(200).json(featuredProduct);

  } catch (error) {
    console.log("error in getFeaturedProduct controller", error);
    res.status(500).json({message:"Server error", error: error.message});
  }
}

export const createProduct = async (req,res)=>{
  try {
    const {
      name,
      description,
      detail,
      image,
      bannerImage,
      catagory,
      isFeatured
    }= req.body;

    let cloudinaryResponseImage  = null;
    let cloudinaryResponseBannerImage = null;

    if(image){
      console.log("uploading image to cloudinary");
      cloudinaryResponseImage = await cloudinary.uploader.upload(image,{folder:"products/images"});

    }
    if(bannerImage){
      cloudinaryResponseBannerImage = await cloudinary.uploader.upload(bannerImage,{folder:"products/banners"})
    }
    let productCatagory = await Catagory.findOne({name:catagory});


    const product = await Product.create({
      name,
      description,
      detail,
      image_url:cloudinaryResponseImage.secure_url ? cloudinaryResponseImage.secure_url : "",
      banner_image_url:cloudinaryResponseBannerImage.secure_url ?cloudinaryResponseBannerImage.secure_url : "",
      catagory_id:productCatagory._id,
      isFeatured
    })

    res.status(201).json({message:"Product created successfully",product});
  } catch (error) {
    console.log("error on the createProduct controller",error);
    res.status(500).json({message:"server error",error})
  }

} 

export const deleteProduct = async (req,res)=>{
  try {
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({message:"Product not found"});
    } 
    if(product.image_url){
      const publicId = product.image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/images/${publicId}`);
        console.log("product image deleted from cloudinary");

      } catch (error) {
        console.log("error deleting product image from cloudinary",error);

      }
    }
    if(product.banner_image_url){
      const publicId = product.banner_image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/banners/${publicId}`);
        console.log("product banner image deleted from cloudinary");

      } catch (error) {
        console.log("error deleting product image from cloudinary",error);

      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Product deleted successfully"});
  } catch (error) {
    console.log("error on deleteProduct controller");
    res.status(401).json({message:"server error"})
    
  }
}

export const getProductByCatagory = async (req,res)=>{
  try { 
    const {catagory} = req.params;
    const catagory_id =await Catagory.findOne({name:catagory}).select("_id") ;
    if(!catagory_id){
      res.status(404).json({message:"Catagory not found"})
    }
    const products = await Product.find({catagory_id:catagory_id._id}).populate("catagory_id","name -_id").lean();
    res.status(200).json(products);
    
  } catch (error) {
    console.log("error on getProductByCatagory controller",error);
    res.status(500).json({message:"server error",error: error.message})
  }
}

export const toggleFeaturedProduct = async (req,res)=>{
  try {
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({message:"Product not found"});
    }
    product.isFeatured = !product.isFeatured;
    const updateedProduct = await product.save();
    await updateFeaturedCache();
    res.status(200).json({message:"Product featured status toggled",updateedProduct});
  } catch (error) {
    console.log("error on toggleFeaturedProduct controller",error);
    res.status(500).json({message:"server error",error: error.message})
  }
}

const updateFeaturedCache = async ()=>{
  try {
    const featuredProduct = await Product.find({isFeatured:true}).populate("catagory_id","name -_id").lean();
    await redis.set("featured_product",JSON.stringify(featuredProduct));
    console.log("featured product cache updated");
  } catch (error) {
    console.log("error updating featured product cache",error);
  }
}

export const searchProduct = async (req,res)=>{
  try {
    const query = req.body;
    const products = await Product.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {description:{$regex:query,$options:"i"}},
        {detail:{$regex:query,$options:"i"}}
      ]
    }).populate("catagory_id","name -_id").lean();

    if(!products || products.length === 0){
      return res.status(404).json({message:"No products found"});
    }
    res.status(200).json(products);
  } catch (error) {
    console.log("error on searchProduct controller",error);
    res.status(500).json({message:"server error",error: error.message})
  }
}

export const createCategory = async (req,res)=>{
  try {
    const {name,description} = req.body;

    const categoryExsits = await Catagory.findOne({name});
    if(categoryExsits){
      return res.status(400).json({message:"category already exists"})
    }
    const category = await Catagory.create({
      name,
      description
    });
    res.status(201).json({message:"Category created successfully",category})

  } catch (error) {
   res.status(500).json({message:"Server error", error: error.message}); 
  }
}

export const getCategory = async (req,res)=>{
  try {
    const category = await Catagory.find();
    res.status(200).json({category});
  } catch (error) {
    res.status(500).json({message:"Server error", error: error.message});
    
  }
}

export const editProduct = async (req, res) => {
  try {
    const { name, description, detail, image, bannerImage, catagory, isFeatured } = req.body;

    const updateField= {};

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const getPublicIdFromUrl = (url, folder) => {
      try {
        const parts = new URL(url).pathname.split("/");
        const fileName = parts.pop(); // filename.ext
        if (!fileName) return null;
        const nameWithoutExt = fileName.split(".")[0];
        return `${folder}/${nameWithoutExt}`;
      } catch {
        return null;
      }
    };

    if (image) {
      if (product.image_url) {
        const publicId = getPublicIdFromUrl(product.image_url, "products/images");
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log("Old product image deleted from Cloudinary");
          } catch (err) {
            console.log("Error deleting old product image:", err);
          }
        }
      }

      try {
        const uploadRes = await cloudinary.uploader.upload(image, { folder: "products/images" });
        updateField.image_url = uploadRes.secure_url;
      } catch (err) {
        console.log("Error uploading new product image:", err);
      }
    }

    // Update banner image if provided
    if (bannerImage) {
      if (product.banner_image_url) {
        const publicId = getPublicIdFromUrl(product.banner_image_url, "products/banners");
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log("Old product banner deleted from Cloudinary");
          } catch (err) {
            console.log("Error deleting old banner image:", err);
          }
        }
      }

      try {
        const uploadRes = await cloudinary.uploader.upload(bannerImage, { folder: "products/banners" });
        updateField.banner_image_url = uploadRes.secure_url;
      } catch (err) {
        console.log("Error uploading new banner image:", err);
      }
    }

    if (name) updateField.name = name;
    if (description) updateField.description = description;
    if (detail) updateField.detail = detail;
    if (typeof isFeatured === "boolean") updateField.isFeatured = isFeatured;
    if (catagory) {
      const productCategory = await Catagory.findOne({ name: catagory });
      if (productCategory) updateField.catagory_id = productCategory._id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: updateField }, { new: true });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.log("Error in editProduct controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editCategory = async (req,res)=>{
  try {
    const {name,description} = req.body;
    const category = await Catagory.findById(req.params.id);
    if(!category){
      return res.status(404).json({message:"Category not found"});
    }
    if(name) category.name = name;
    if(description) category.description = description;
    const updatedCategory = await category.save();
    res.status(200).json({message:"Category updated successfully",updatedCategory});
  } catch (error) {
    console.log("error on editCategory controller",error);
    res.status(500).json({message:"server error",error: error.message})
  }

}

export const deleteCategory = async (req,res)=>{
  try {
    const category = await Catagory.findById(req.params.id);
    if(!category){
      return res.status(404).json({message:"Category not found"});
    }
    const productsWithCategory = await Product.find({catagory_id:category._id});
    if(productsWithCategory.length > 0){
      return res.status(400).json({message:"Cannot delete category with associated products"});
    }
    await Catagory.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Category deleted successfully"});
  } catch (error) {
    console.log("error on deleteCategory controller",error);
    res.status(500).json({message:"server error",error: error.message})
  }
}
