import mongoose from "mongoose";
import mongooseSequence  from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)



const setingSchema = new mongoose.Schema({
  _id:Number,
  phone_primary:{
    type:String,
    required:[true,"primary phone number is required"]
  },
  phone_secondary:{
    type:String,
    required:[true,"secondary phone number is required"]
  },
  address:{
    type:String,
    required:[true,"address info is required"]
  },
  google_map_url:{
    type:String,
    required:[true,"the google map uri is required"]
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true
  },
  facebook_url:{
    type:String, 
    required:[true,"facebook url is required"]
  },
  instagram_url:{
    type:String,
    required:[true,"instagram url is required"]
  },
  linkedin_url:{
    type:String,
    required:[true,"linkedin url is required"]
  },
  twitter_url:{
    type:String, 
    required:[true,"twitter url is required"]
  },
},{timestamps:true,_id:false})


setingSchema.plugin(AutoIncrement,{id:"setting_seq",inc_field:"_id"});



const Setting = mongoose.model("Setting",setingSchema);
export default Setting;
