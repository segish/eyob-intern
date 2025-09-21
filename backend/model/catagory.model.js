import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
import slugify from "slugify";

const AutoIncrement = mongooseSequence(mongoose)


const catagorySchema = new mongoose.Schema({
  _id:Number,
  name:{
    type:String,
    required:[true,"the catagory is required"],
    unique:[true,"this category is already exsit"]
  },
  description:{
    type:String,
    required:[true,"the description is required"]
  },
  slug:{
    type:String,
    unique:true
  }
},{timestamps:true,_id:false})

catagorySchema.plugin(AutoIncrement,{id:"catagory_seq",inc_field:"_id"});

catagorySchema.pre("save",function(next){
  if(!this.isModified("name")) return next();
  try {
    this.slug = slugify(this.name,{lower:true,strict:true})
    next();
  } catch (error) {
    next(error)
  }
});

const Catagory = mongoose.model("Catagory",catagorySchema);

export default Catagory;