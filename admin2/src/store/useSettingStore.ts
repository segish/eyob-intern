import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";


type Setting = {
  _id: number;
  phone_primary:string;
  phone_secondary:string;
  address:string;
  google_map_url:string;
  email:string;
  facebook_url:string;
  instagram_url:string;
  twitter_url:string;
  tictok_url:string;
}
interface SettingStoreState {
  setting: Setting | null;
  loading: boolean;
  getSetting:()=>  Promise<void>;
  updatedSetting:(data:Partial<Setting>)=> Promise<void>;
}

export const useSettingStore = create<SettingStoreState>((set)=>({
  loading:false,
  setting:null as Setting | null,
  getSetting: async()=>{
    set({loading:true})
    try {
      const res = await axios.get("/setting");
      set({setting:res.data.setting,loading:false});
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updatedSetting: async(data)=>{
    set({loading:true})
    try {
      const res = await axios.post("/setting/update",data);
      set({setting:res.data.setting,loading:false});
      toast.success("Setting updated successfully")
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }
}))