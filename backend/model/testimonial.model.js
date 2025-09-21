import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)


const testimonialSchema = new mongoose.Schema({
  _id:Number,
  name:{
    type:String,
    required:[true,"the catagory is required"]
  },
  designation:{
    type:String,
  },
  message:{
    type:String,
    required:[true,"Message is required"]
  },
  photo_url:{
    type:String,
    required:[true,"Photo url is rquired"]
  }

},{timestamps:true,_id:false})

testimonialSchema.plugin(AutoIncrement,{id:"testimonial_seq",inc_field:"_id"});



const Testimonial = mongoose.model("Testimonial",testimonialSchema);

export default Testimonial;