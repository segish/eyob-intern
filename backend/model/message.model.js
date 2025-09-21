import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)


const messageSchema = new mongoose.Schema({
  _id:Number,
  name:{
    type:String,
    required:[true,"the message name is required"]
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true
  },
  phoneNumber:{
    type:String,
    required:[true,"Phone number is required"]
  },
  message:{
    type:String,
    required:[true,"Message is required"]
  }
},{timestamps:true,_id:false})

messageSchema.plugin(AutoIncrement,{id:"message_seq",inc_field:"_id"});



const Message = mongoose.model("Message",messageSchema);

export default Message;