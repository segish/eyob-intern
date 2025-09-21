import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  message: string;
};
interface UserState {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkingAuth:boolean;
  checkAuth:()=>Promise<void>;
  createUser:(fullName:string,email:string,role:string,password:string)=>Promise<void>;
  getAllUsers:()=> Promise<void>;
  deleteUser:(id:Number)=> Promise<void>;
  updateUser:(id:number,changedFields:Partial<User>)=>Promise<void>;
  refreshToken:()=>Promise<string>
}


export const useUserStore = create<UserState>((set,get)=>({
  user:null,
  users:[] as User[],
  loading:false,
  checkingAuth:true,
  login:async (email,password)=>{
    set({loading:true})
    try {
      const res = await axios.post("/auth/login",{email,password});
      const user: User = {
        id: res.data._id,
        name: res.data.fullName,
        email: res.data.email,
        role: res.data.role,
        message: res.data.message,
      };

      toast(user.message);
      set({ user, loading: false });
      console.log(user.message)
      return true;
    } catch (error) {
      set({ loading: false });
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
      return false;
    }
  },
  logout:async()=>{
    try {
      await axios.post("/auth/logout");
      set({user:null});
    } catch (error) {
      
    }
  },
  checkAuth:async()=>{
    set({checkingAuth:true})
    try {
      const res = await axios.get("/auth/profile");
      const user: User = {
        id: res.data._id,
        name: res.data.fullName,
        email: res.data.email,
        role: res.data.role,
        message: res.data.message,
      };
      set({user,checkingAuth:false})
    } catch (error) {
      set({checkingAuth:false,user:null})
    }
  },
  getAllUsers:async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/user/getallusers");
      const users = res.data.users.map((user: any) => ({
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        message: user.message,
      }));
      console.log(users);
      set({users:users,loading:false});
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  createUser:async (fullName,email,role,password)=>{
    set({loading:true});
    try {
      const res = await axios.post("/user/create",{fullName,email,role,password});
      toast.success(res.data.message || "User created successfully");
      set((state: UserState)=>({users:[...state.users,res.data.user],loading:false}));
      set({loading:false})
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deleteUser:async (id)=>{
    set({loading:true});
    try {
      const res = await axios.delete(`/user/delete/${id}`);
      toast.success(res.data.message || "User deleted successfully");
      set((state: UserState)=>({users:state.users.filter((user)=>user.id !== id),loading:false}));
      set({loading:false})
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updateUser:async (id,changedFields)=>{
    set({loading:true});
    try {
      const res = await axios.patch(`/user/edit/${id}`,changedFields);
      set((state: UserState)=>({users:[...state.users,res.data.user]}));
      set({loading:false})
      toast.success(res.data.message || "User updated successfully");
      
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  refreshToken:async ()=>{
    if(get().checkingAuth) return;
    set({checkingAuth:true});
    try {
      const res = await axios.post("/auth/refresh-token");
      set({checkingAuth:false});
      return res.data
    } catch (error) {
      set({user:null,checkingAuth:false});
      throw error;
    }
  }


}));


let refreshPromise: Promise<any> | null = null;

axios.interceptors.response.use(
  (response) => response,
  async (error)=>{
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;


      try {
        if(refreshPromise){
          await refreshPromise;
          return axios(originalRequest)
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
        
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error)
  }
)