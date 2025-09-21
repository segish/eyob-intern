import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";




type Servics = {
  _id: number;
  title:string;
  description: string;
  detail: string;
  image: string;
  bannerImage: string;
  image_url:string;
  banner_image_url:string;
}
interface ServiceStoreState {
  services: Servics[];
  setServices: (services: Servics[]) => void;
  loading: boolean;
  createService: (title:string,
  description: string,
  detail: string,
  image: string,
  bannerImage: string) => Promise<void>;
  getAllServices:()=>  Promise<void>;
  deleteService:(id:Number)=>  Promise<void>;
  updateService:(id:number,changedFields:Partial<Servics>)=>Promise<void>;
}

export const useServiceStore = create<ServiceStoreState>((set) =>({
  loading:false,
  services:[] as Servics[],
  setServices:(services: Servics[])=>set({services}),
  getAllServices: async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/service");
      set({services:res.data.services,loading:false});
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  createService: async (title,description,detail,image,bannerImage) =>{
    set({loading:true})
    try {
      const res = await axios.post("/service/create",{
        title,
        description,
        detail,
        image,
        bannerImage
      });
      toast.success(res.data.message || "Service created successfully");
      set((state: { services: Servics[] })=>({services:[...state.services,res.data.service],loading:false}));
      set({loading:false})
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updateService:async (id,changedFields)=>{
    set({loading:true})
    try {
      const res = await axios.patch(`/service/edit/${id}`,changedFields);
      console.log(res.data)
      set((state: ServiceStoreState)=>({services:[...state.services,res.data.service]}));
      set({loading:false})
      toast.success(res.data.message || "Service updated successfully");

      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deleteService:async (id)=>{
    set({loading:true})
    try {
      const res = await axios.delete(`/service/delete/${id}`);
      set((state: ServiceStoreState)=>({services:state.services.filter(s=>s._id !== id),loading:false}));
      toast.success(res.data.message || "Service deleted successfully");
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }
}))