import Setting from "../model/setting.model.js";

export const updateSetting = async (req,res)=>{
  try {
    const query = req.body;
    const setting = await Setting.findOneAndUpdate(
      {},query,{new:true,upsert:true}
    );
    res.status(200).json(setting); 
  } catch (error) {
    console.log("error on the updateSetting controller",error);
    res.status(500).json({message:"server error",error});
  }
}
export const getInformations = async (req,res)=>{
  try {
    const setting = await Setting.findOne();
    if(!setting){
      return res.status(404).json({message:"No setting found"})
    }
    res.status(200).json({setting});
  } catch (error) {
    console.log("error on the getSetting controller",error);
    res.status(500).json({message:"server error",error});
  }
}