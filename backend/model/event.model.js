import mongoose from "mongoose";
import slugify from "slugify";
import mongooseSequence  from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)



const eventSchema = new mongoose.Schema({
  _id:Number,
  title:{
    type:String,
    required:[true,"title of the product is required"]
  },
  content:{
    type:String,
    required:[true,"content is required"]
  },
  detail:{
    type:String,
    required:[true,"detail info is required"]
  },
  image_url:{
    type:String,
    required:[true,"the image of the product is required"]
  },
  banner_image_url:{
    type:String,
    required:[true,"banner image of the product is rquired"]
  },
  slug:{
    type:String,
    unique:true,
  }
},{timestamps:true,_id:false})


eventSchema.plugin(AutoIncrement,{id:"event_seq",inc_field:"_id"});

eventSchema.pre("save",function(next){
  if(!this.isModified("title")) return next();
  try {
    this.slug = slugify(this.title,{lower:true,strict:true})
    next();
  } catch (error) {
    next(error)
  }
});

const Event = mongoose.model("Event",eventSchema);
export default Event;
