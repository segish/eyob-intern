import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
import bcrypt from "bcryptjs";

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema({
  _id:Number,
  fullName:{
    type:String,
    required:[true,"Full name is required"]
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    minLength:[6,"Password must be at least 6 characters"]
  },
  role:{
    type:String,
    enum:["admin","productManager","serviceManager","socialManager"],
    default:"admin"
  }
},{timestamps:true,_id:false});

userSchema.plugin(AutoIncrement,{id:"user_seq",inc_field:"_id"});



userSchema.pre('save',async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User",userSchema);
export default User;