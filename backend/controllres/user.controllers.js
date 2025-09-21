import User from '../model/user.model.js';

export const createUser = async (req, res) => {
  const {fullName, email, password, role} = req.body;

  try {
    const userExsits = await User.findOne({email});
    if(userExsits){
      return res.status(400).json({message:"User already exists"});
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role
    });
    res.status(201).json({message:"User created successfully",user});
  } catch (error) {
    res.status(500).json({message:"Server error", error: error.message});
  }
}

export const searchUser = async (req,res)=>{
  const query = req.body;
  try {
    const users = await User.find({
      $or:[
        {fullName:{$regex:query,$options:"i"}},
        {email:{$regex:query,$options:"i"}},
        {role:{$regex:query,$options:"i"}}
      ]
    });
    if(!users || users.length === 0){
      return res.status(404).json({message:"No users found"});
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message:"Server error", error: error.message});
  }
}

export const editUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { fullName, email, phone, role } = req.body;
    console.log(req.body);

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (role) updateFields.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in editUserProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllUsers = async (req,res)=>{
  try {
    const users = await User.find().select("-password");
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({message:"Server error", error: error.message});
  }
}

export const deleteUserProfile = async (req,res)=>{
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
} 