import cloudinary from "../lib/cloudinary.js";
import Testimonial from "../model/testimonial.model.js";

export const createTestimonial = async (req,res)=>{
  try {
    const {
      name,
      designation,
      message,
      photo,
    }= req.body;
    let cloudinaryResponsePhoto  = null;

    if(photo){
      cloudinaryResponsePhoto = await cloudinary.uploader.upload(photo,{folder:"testimonials/photos"});
    }
    const testimonial = await Testimonial.create({
      name,
      designation,
      message,
      photo_url:cloudinaryResponsePhoto?.secure_url || ""
    });
    res.status(201).json({testimonial,message:"Testimonial created successfully"});
  } catch (error) {
    console.log("error on the createTestimonial controller",error);
    res.status(500).json({message:"server error",error});
  }
}

export const getAllTestimonials = async (req,res)=>{
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json({testimonials});
  } catch (error) {
    console.log("error in getAllTestimonials controller",error);
    res.status(500).json({message:"Server error",error:error.message});
  }
}

export const  searchTestimonial = async (req,res)=>{
  try {
    const query = req.body;
    const testimonials = await Testimonial.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {designation:{$regex:query,$options:"i"}},
        {message:{$regex:query,$options:"i"}}
      ]
    });
    if(testimonials.length === 0){
      return res.status(404).json({message:"No testimonials found"});
    }
    res.status(200).json(testimonials);
  } catch (error) {
    console.log("error on the searchTestimonial controller",error);
    res.status(500).json({message:"server error",error});
  }
}
export const editTestimonial = async (req, res) => {
  try {
    const { name, message, designation, photo } = req.body; // added designation

    let updateField = {};
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // If a new photo is provided
    if (photo) {
      if (testimonial.photo_url) {
        const publicId = testimonial.photo_url.split("/").slice(-1)[0].split(".")[0];
        try {
          await cloudinary.uploader.destroy(`testimonials/photos/${publicId}`);
          console.log("Old testimonial photo deleted from Cloudinary");
        } catch (error) {
          console.log("Error deleting old testimonial photo:", error);
        }
      }

      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(photo, {
          folder: "testimonials/photos",
        });
        updateField.photo_url = cloudinaryResponse.secure_url || "";
      } catch (error) {
        console.log("Error uploading new testimonial photo:", error);
      }
    }

    // Add other fields if provided
    if (name) updateField.name = name;
    if (message) updateField.message = message;
    if (designation) updateField.designation = designation;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );

    res.json({
      testimonial: updatedTestimonial,
      message: "Testimonial successfully updated",
    });
  } catch (error) {
    console.log("Error in editTestimonial controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTestimonial= async (req,res)=>{
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if(!testimonial){
      return res.status(404).json({message:"testiminoal not found"})
    }
    if(testimonial.photo_url){
      const publicId = testimonial.photo_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`testimonials/photos/${publicId}`);
        console.log("testimonial photo deleted from cloudinary");
      } catch (error) {
        console.log("error deleteing testimonial photo from clodinary",error);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"testimonial delete successfully"})

  } catch (error) {
    console.log("error in deleting controllers",error);
    res.status(500).json({message:"server error",error:error.message});
  }
}

