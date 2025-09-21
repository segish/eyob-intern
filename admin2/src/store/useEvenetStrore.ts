import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";



type Event = {
  _id: number;
  title:string;
  content:string;
  detail:string;
  image: string;
  bannerImage: string;
  image_url:string;
  banner_image_url:string;
}
interface EventStoreState {
  events: Event[];
  loading: boolean;
  getAllEvents:()=>  Promise<void>;
  deleteEvent:(id:Number)=> Promise<void>;
  createEvent: (title:string,
  content: string,
  detail: string,
  image: string,
  bannerImage: string) => Promise<void>;
  updateEvent:(id:number,changedFields:Partial<Event>)=>Promise<void>;
}


export const useEventStore = create<EventStoreState>((set) =>({
  loading:false,
  events:[] as Event[],
  getAllEvents: async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/event");
      set({events:res.data.events,loading:false});

    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  createEvent:async (title,content,detail,image,bannerImage,)=>{
    set({loading:true})
    try {
      const res = await axios.post("/event/create",{
        title,
        content,
        detail,
        image,
        bannerImage
      });
      toast.success(res.data.message || "Event created successfully");
      set((state: { events: Event[] })=>({services:[...state.events,res.data.event],loading:false}));
      set({loading:false})
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deleteEvent:async (id)=>{
    set({loading:true});
    try {
      const res = await axios.delete(`/event/delete/${id}`);
      set((state: EventStoreState)=>({events:state.events.filter(event=>event._id !== id)}));
      toast.success(res.data.message || "Event deleted successfully");
      set({loading:false})
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updateEvent:async (id,changedFields)=>{
    set({loading:true});
    try {
      const res = await axios.patch(`/event/edit/${id}`,changedFields);
      set((state: EventStoreState)=>({events:[...state.events,res.data.event]}));
      set({loading:false})
      toast.success(res.data.message || "Event updated successfully");
      
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }

}))