import cloudinary from "../lib/cloudinary.js";
import Service from "../model/service.model.js";

export const createService = async (req,res)=>{
  try {
    const {
      title,
      description,
      detail,
      image,
      bannerImage,
    }= req.body;
    let cloudinaryResponseImage  = null;
    let cloudinaryResponseBannerImage = null;
    if(image){
      cloudinaryResponseImage = await cloudinary.uploader.upload(image,{folder:"services/images"});
    }
    if(bannerImage){
      cloudinaryResponseBannerImage = await cloudinary.uploader.upload(bannerImage,{folder:"services/banners"})
    }
    const service = await Service.create({
      title,
      description,
      detail,
      image_url:cloudinaryResponseImage.secure_url ? cloudinaryResponseImage.secure_url : "",
      banner_image_url:cloudinaryResponseBannerImage.secure_url ?cloudinaryResponseBannerImage.secure_url : "",
    });

    res.status(201).json({message:"Sercvice created successfully",service})

  } catch (error) {
    console.log("error on the createService controller",error);
    res.status(500).json({message:"server error",error})
  }
}

export const getAllServices = async (req,res)=>{
  try {
    const services = await Service.find();
    res.status(200).json({services});
  } catch (error) {
    console.log("error in getAllServices controller", error);
    res.status(500).json({message:"Server error", error: error.message});
  }
}

export const searchService = async (req,res)=>{
  try {
    const query = req.body;
    const services = await Service.find({
      $or:[
        {title:{$regex:query,$options:"i"}},
        {description:{$regex:query,$options:"i"}},
        {detail:{$regex:query,$options:"i"}}
      ]
    });
    if(services.length === 0){
      return res.status(404).json({message:"No services found"})
    }

    res.status(200).json(services);
    
  } catch (error) {
    console.log("error on searchService controller",error);
    res.status(500).json({message:"Server error", error: error.message});
  }
}

export const editService = async (req, res) => {
  try {
    const { title, description, detail, image, bannerImage } = req.body;

    let updateField = { title, description, detail }; 
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update image if provided
    if (image) {
      if (service.image_url) {
        const publicId = service.image_url.split("/").slice(-1)[0].split(".")[0];
        try {
          await cloudinary.uploader.destroy(`services/images/${publicId}`);
          console.log("Service image deleted from cloudinary");
        } catch (error) {
          console.log("Error deleting old image:", error);
        }
      }
      const cloudinaryResponseImage = await cloudinary.uploader.upload(image, {
        folder: "services/images",
      });
      updateField.image_url = cloudinaryResponseImage.secure_url || "";
    }

    // Update banner if provided
    if (bannerImage) {
      if (service.banner_image_url) {
        const publicId = service.banner_image_url.split("/").slice(-1)[0].split(".")[0];
        try {
          await cloudinary.uploader.destroy(`services/banners/${publicId}`);
          console.log("Service banner deleted from cloudinary");
        } catch (error) {
          console.log("Error deleting old banner:", error);
        }
      }
      const cloudinaryResponseBanner = await cloudinary.uploader.upload(bannerImage, {
        folder: "services/banners",
      });
      updateField.banner_image_url = cloudinaryResponseBanner.secure_url || "";
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );

    res.json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    console.log("Error in editService controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteService = async (req,res)=>{
  try {
    const service = await Service.findById(req.params.id);  
    if(!service){
      return res.status(404).json({message:"Service not found"});
    }
    if(service.image_url){
      const publicId = service.image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`services/images/${publicId}`);
        console.log("service image deleted from cloudinary");
      } catch (error) {
        console.log("error deleting service image from cloudinary",error);
      }
    }
    if(service.banner_image_url){
      const publicId = service.banner_image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`services/banners/${publicId}`);
        console.log("service banner image deleted from cloudinary");
      } catch (error) {
        console.log("error deleting service banner image from cloudinary",error);
      }
    } 
    await Service.findByIdAndDelete(req.params.id);
    res.json({message:"Service deleted successfully"});
  } catch (error) {
    console.log("error on deleteService controller",error);
    res.status(500).json({message:"Server error", error: error.message});
  } 
}