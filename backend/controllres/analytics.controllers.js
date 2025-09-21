import Event from "../model/event.model.js";
import Message from "../model/message.model.js";
import Partner from "../model/partner.model.js";
import Product from "../model/product.model.js";
import Service from "../model/service.model.js";
import Testimonial from "../model/testimonial.model.js";
import User from "../model/user.model.js";


export const getAnalytics = async (req, res) => {
  try {
    const analytics = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      services: await Service.countDocuments(),
      events: await Event.countDocuments(),
      testimonials: await Testimonial.countDocuments(),
      partners: await Partner.countDocuments(),
      messages: await Message.countDocuments(),
    };

    res.status(200).json({analytics});
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
