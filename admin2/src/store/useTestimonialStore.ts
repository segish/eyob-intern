import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type Testimonial = {
  _id: number;
  name:string;
  designation:string;
  message:string;
  photo:string;
  photo_url:string;
}
interface TestimonialStoreState {
  testimonials: Testimonial[];
  loading: boolean;
  getAllTestimonials:()=>  Promise<void>;
  createTestimonial: (name:string,
  designation:string,
  message:string,
  photo:string) => Promise<void>;
  deteleTestimonial:(id:Number)=>  Promise<void>;
  updateTestimonial:(id:number,changedFields:Partial<Testimonial>)=>Promise<void>;
}

export const useTestimonialStore = create<TestimonialStoreState>((set)=>({
  loading:false,
  testimonials:[] as Testimonial[],
  getAllTestimonials: async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/testimonial");
      set({testimonials:res.data.testimonials,loading:false});
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  createTestimonial: async (name,designation,message,photo) =>{
    set({loading:true})
    try {
      const res = await axios.post("/testimonial/creste",{
        name,
        designation,
        message,
        photo
      });
      toast.success(res.data.message || "Testimonial created successfully");
      set((state: { testimonials: Testimonial[] })=>({testimonials:[...state.testimonials,res.data.testimonial],loading:false}));
      set({loading:false})

      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deteleTestimonial: async (id) =>{
    set({loading:true});
    try {
      const res = await axios.delete(`/testimonial/delete/${id}`);
      toast.success(res.data.message || "Testimonial deleted successfully");
      set((state: { testimonials: Testimonial[] })=>({testimonials:state.testimonials.filter(t=>t._id !== id),loading:false}));
      set({loading:false});
    }catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updateTestimonial: async (id,changedFields) =>{
    set({loading:true})
    try {
      const res = await axios.patch(`/testimonial/edit/${id}`,
        changedFields
      );
      toast.success(res.data.message || "Testimonial updated successfully");
      set((state: { testimonials: Testimonial[] })=>({testimonials:[...state.testimonials,res.data.testimonial],loading:false}));
      set({loading:false})

    }catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }
}))