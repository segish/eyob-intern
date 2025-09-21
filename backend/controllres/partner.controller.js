import cloudinary from "../lib/cloudinary.js";
import Partner from "../model/partner.model.js";

export const getAllPartner = async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json({ partners });
  } catch (error) {
    console.log("error in getAllPartner controller", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const createPartner = async (req,res)=>{
  try {
    const {name,image}= req.body;
    let cloudinaryResponseImage = null;
    if(image){
      cloudinaryResponseImage = await cloudinary.uploader.upload(image,{folder:"partner/images"});
    }
    const partner = await Partner.create({
      name,
      image_url:cloudinaryResponseImage?.secure_url || ""
    });

    res.status(200).json({partner,message:"Partner created successfully"});

    
  } catch (error) {
    console.log("error on the createPartner controller",error);
    res.status(500).json({message:"server error",error:error.message});
  }
}
export const searchPartner = async (req,res)=>{
  try {
    const query = req.body;
    const partner = await Partner.find({
      $or:[
        {name:{$regex:query,$options:"i"}}
      ]
    });
    if(partner.length === 0){
      return res.status(404).json({message:"No partner found"});
    }
    res.status(200).json(partner);
  } catch (error) {
    console.log("error on the searchPartner controller",error);
    res.status(500).json({message:"server error",error})
  }
}

export const editPartner = async (req, res) => {
  try {
    const { id } = req.params;
    let updateField = {};
    let cloudinaryResponseImage = null;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const { name, image } = req.body;
    if (name) updateField.name = name;

    if (image) {
      if (partner.image_url) {
        const publicId = partner.image_url.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`partner/images/${publicId}`);
          console.log("Old partner image deleted from Cloudinary");
        } catch (error) {
          console.log("Error deleting old partner image from Cloudinary", error);
        }
      }

      try {
        cloudinaryResponseImage = await cloudinary.uploader.upload(image, {
          folder: "partner/images",
        });
        updateField.image_url = cloudinaryResponseImage.secure_url || "";
      } catch (error) {
        console.log("Error uploading new partner image to Cloudinary", error);
      }
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { $set: updateField },
      { new: true }
    );

    res.status(200).json({
      partner: updatedPartner,
      message: "Partner updated successfully",
    });
  } catch (error) {
    console.log("Error in editPartner controller", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deletePartner = async (req,res)=>{
  try {
    const partner = await Partner.findById(req.params.id);
    if(!partner){
      return res.status(404).json({message:"partner not found"})
    }
    if(partner.image_url){
      const publicId = partner.image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`partner/images/${publicId}`);
      } catch (error) {
        console.log("error deleting partner image from cloudinary",error);
      }
    }
    await Partner.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.log("error in deletePartner controller",error);
    res.status(500).json({message:"server error",error:error.message});

  }
}