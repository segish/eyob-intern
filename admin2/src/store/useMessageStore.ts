import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type  Message = {
  _id: number;
  name:string;
  email:string;
  phoneNumber:string;
  message:string;
}
interface MessageStoreState {
  messages: Message[];
  loading: boolean;
  getAllMessages:()=>  Promise<void>;
  deleteMessage:(id:Number)=> Promise<void>;
}

export const useMessageStore = create<MessageStoreState>((set)=>({
  loading:false,
  messages:[] as Message[],
  getAllMessages: async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/message");
      set({messages:res.data.messages,loading:false});
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deleteMessage:async (id)=>{
    set({loading:true})
    try {
      const res = await axios.delete(`/message/delete-message/${id}`);
      toast.success(res.data.message || "Message deleted successfully");
      set((state: { messages: Message[] })=>({messages:state.messages.filter((message)=>message._id !== id),loading:false}));
      set({loading:false})
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }
}))