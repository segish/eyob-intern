import cloudinary from "../lib/cloudinary.js";
import Event from "../model/event.model.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      content,
      detail,
      image,
      bannerImage,
    } = req.body;
    let cloudinaryResponseImage = null;
    let cloudinaryResponseBannerImage = null;

    if (image) {
      cloudinaryResponseImage = await cloudinary.uploader.upload(image, { folder: "events/images" });
    }
    if (bannerImage) {
      cloudinaryResponseBannerImage = await cloudinary.uploader.upload(bannerImage, { folder: "events/banners" });
    }
    const event = await Event.create({
      title,
      content,
      detail,
      image_url: cloudinaryResponseImage?.secure_url || "",
      banner_image_url: cloudinaryResponseBannerImage?.secure_url || "",
    });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.log("error on the createEvent controller", error);
    res.status(500).json({ message: "server error", error });
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({events});
  } catch (error) {
    console.log("error in getAllEvents controller", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const searchEvent = async (req, res) => {
  try {
    const query = req.body;
    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { detail: { $regex: query, $options: "i" } }
      ]
    });
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    res.status(200).json(events);
  } catch (error) {
    console.log("error in searchEvent controller", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const editEvent = async (req, res) => {
  try {
    const { title, description, detail, image, bannerImage } = req.body;

    let updateField = { title, description, detail }; 
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update image if provided
    if (image) {
      if (event.image_url) {
        const publicId = event.image_url.split("/").slice(-1)[0].split(".")[0];
        try {
          await cloudinary.uploader.destroy(`events/images/${publicId}`);
          console.log("Old event image deleted from Cloudinary");
        } catch (error) {
          console.log("Error deleting old event image:", error);
        }
      }

      const cloudinaryResponseImage = await cloudinary.uploader.upload(image, {
        folder: "events/images",
      });
      updateField.image_url = cloudinaryResponseImage.secure_url || "";
    }

    // Update banner if provided
    if (bannerImage) {
      if (event.banner_image_url) {
        const publicId = event.banner_image_url.split("/").slice(-1)[0].split(".")[0];
        try {
          await cloudinary.uploader.destroy(`events/banners/${publicId}`);
          console.log("Old event banner deleted from Cloudinary");
        } catch (error) {
          console.log("Error deleting old event banner:", error);
        }
      }

      const cloudinaryResponseBanner = await cloudinary.uploader.upload(bannerImage, {
        folder: "events/banners",
      });
      updateField.banner_image_url = cloudinaryResponseBanner.secure_url || "";
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );

    res.json({ event: updatedEvent, message: "Event successfully updated" });
  } catch (error) {
    console.log("Error in editEvent controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);  
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if(event.image_url){
      const publicId = event.image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`events/images/${publicId}`);
        console.log("event image deleted from cloudinary");
      } catch (error) {
        console.log("error deleting event image from cloudinary",error);
      }
    }
    if(event.banner_image_url){
      const publicId = event.banner_image_url.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`events/banners/${publicId}`);
        console.log("event banner image deleted from cloudinary");
      } catch (error) {
        console.log("error deleting event banner image from cloudinary",error);
      }
    }
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });

  } catch (error) {
    console.log("error in deleteEvent controller", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}