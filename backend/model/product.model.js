import mongoose from "mongoose";
import slugify from "slugify";
import mongooseSequence  from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose)



const productSchema = new mongoose.Schema({
  _id:Number,
  name:{
    type:String,
    required:[true,"Name of the product is required"]
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
  // product_link:{
  //   type:String,
  //   required:[true,"product link is required"]
  // },
  catagory_id:{
   type: Number, ref: "Catagory"
  },
  isFeatured:{
    type:Boolean,
    default:false
  },
  slug:{
    type:String,
    unique:true,
  }
},{timestamps:true,_id:false})


productSchema.plugin(AutoIncrement,{id:"product_seq",inc_field:"_id"});

productSchema.pre("save",function(next){
  if(!this.isModified("name")) return next();
  try {
    this.slug = slugify(this.name,{lower:true,strict:true})
    next();
  } catch (error) {
    next(error)
  }
});

const Product = mongoose.model("Product",productSchema);
export default Product;
