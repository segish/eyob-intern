import mongoose from "mongoose";
import slugify from "slugify";
import mongooseSequence  from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)



const serviceSchema = new mongoose.Schema({
  _id:Number,
  title:{
    type:String,
    required:[true,"title of the product is required"]
  },
  description:{
    type:String,
    required:[true,"description is required"]
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


serviceSchema.plugin(AutoIncrement,{id:"service_seq",inc_field:"_id"});

serviceSchema.pre("save",function(next){
  if(!this.isModified("title")) return next();
  try {
    this.slug = slugify(this.title,{lower:true,strict:true})
    next();
  } catch (error) {
    next(error)
  }
});

const Service = mongoose.model("Service",serviceSchema);
export default Service;
