import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";



type AnalyticsType = {
  users: number;
  products: number;
  services: number;
  events: number;
  testimonials: number;
  partners: number;
  messages: number;
  settings: number;
};
interface DashboredState {
  analytics: AnalyticsType | null;
  loading: boolean;
  getDate:()=>  Promise<void>;
}

export const useDashbored = create<DashboredState>((set)=>({
  loading:false,
  analytics:null as AnalyticsType | null,
  getDate:async ()=>{
    set({loading:true});
    try {
      const res = await axios.get("/analytics");
      set({loading:false,analytics:res.data.analytics});

    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }
}))