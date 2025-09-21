import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";



type Partner = {
  _id: number;
  name:string;
  image: string;
  image_url:string;
}
interface PartnerStoreState {
  partners: Partner[];
  loading: boolean;
  getAllPartners:()=>  Promise<void>;
  deletePartner:(id:Number)=> Promise<void>;
  createPartner: (name:string,
  image: string) => Promise<void>;
  updatePartner:(id:number,changedFields:Partial<Partner>)=>Promise<void>;
}

export const usePartnerStore = create<PartnerStoreState>((set)=>({
  loading:false,
  partners:[] as Partner[],
  getAllPartners: async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/partner");
      set({partners:res.data.partners,loading:false});

    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  createPartner:async (name,image)=>{
    set({loading:true});
    try {
      const res = await axios.post("/partner/create",{
        name,
        image
      });
      toast.success(res.data.message || "Partner created successfully");
      set((state: { partners: Partner[] })=>({partners:[...state.partners,res.data.partner],loading:false}));
      set({loading:false})

    } catch (error) {
       set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deletePartner: async(id)=>{
    set({loading:true});
    try {
      const res = await axios.delete(`/partner/delete/${id}`);
      toast.success(res.data.message || "Partner deleted successfully");
      set((state: PartnerStoreState)=>({partners:state.partners.filter((partner)=>partner._id !== id),loading:false}));
      set({loading:false})
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updatePartner:async (id,changedFields)=>{
    set({loading:true});
    try {
      const res = await axios.patch(`/partner/edit/${id}`,changedFields);

      toast.success(res.data.message || "Partner updated successfully");
      set((state: { partners: Partner[] })=>({partners:state.partners.map((partner)=>
        partner._id === id ? {...partner,...changedFields} : partner
      ),loading:false}));
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }   
}))