import jwt from "jsonwebtoken"
import User from "../model/user.model.js"
export const protectRoute= async (req,res,next)=>{
  try {
    const accessToken = req.cookies.accessToken;

    if(!accessToken){
      return res.status(401).json({message:"Unauthorized access token provided"})
    }


    try {
      const decode = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decode.userId).select("-password");


      if(!user){
        return res.status(401).json({message:"User not found"})
      }
      req.user = user;
      next();
    } catch (error) {
      if(error.name === "TokenExiredError"){
        return res.status(401).json({message:"Unauthorized - access token expired"})
      }
      throw error
    }

  } catch (error) {
    console.log("Error on the protectRotue controller",error);
    res.status(401).json({message:"Unauthorized invalid access"})
  }
}

export const adminRoute = (req,res,next)=>{
  if(req.user && req.user.role === 'admin'){
    next();
  }else{
    return res.status(403).json({message:"Forbidden - Admins only"})
  }
}
export const roleRoute = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next(); // user has one of the allowed roles → proceed
    } else {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }
  };
};
