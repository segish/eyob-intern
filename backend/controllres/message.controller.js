import Message from "../model/message.model.js";

export const getAllmessages = async (req,res)=>{
  try {
    const message = await Message.find();
    if(!message) return res.status(400).json({message:"not found"});

    res.status(200).json(message);

  } catch (error) {
    console.log("error on the getAllMessage controller",error);
    res.status(500).json({message:"server error"});
  }
}

export const sendMessage =  async (req,res)=>{
  try {
    const {
      name,
      email,
      phoneNumber,
      messageContent
    } = req.body;

    const message = await Message.create({
      name,
      email,
      phoneNumber,
      message:messageContent
    });
  } catch (error) {
    console.log("error on the sendMessage contoller",error);
    res.status(500).json({message:"server error"});
  }
}
export const searchMessage = async (req,res)=>{
  try {
    const query = req.body;

    const message = await Message.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {message:{$regex:query,$options:"i"}},
        {email:{$regex:query,$options:"i"}},
      ]
    })
    if(!message) return res.status(404).json({message:"message not found"});
    res.status(200).json(message);
  } catch (error) {
    console.log("error on the searchMessage controller",error);
    res.status(500).json({message:"server error"});
  }
}

export const deleteMessage = async (req,res)=>{
  try {
    const message = Message.findByIdAndDelete(req.params.id);
    if(!message){
      return res.status(404).json({message:"message not found"})
    }
    res.status(200).json({message:"message deleted successfully"})
  } catch (error) {
    
  }
}