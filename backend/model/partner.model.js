import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)


const partnerSchema = new mongoose.Schema({
  _id:Number,
  name:{
    type:String,
    required:[true,"the catagory is required"]
  },
  image_url:{
    type:String,
    required:[true,"image url is rquired"]
  }

},{timestamps:true,_id:false})

partnerSchema.plugin(AutoIncrement,{id:"partner_seq",inc_field:"_id"});



const Partner = mongoose.model("Partner",partnerSchema);

export default Partner;