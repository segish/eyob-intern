import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function AddUser(){
  const {createUser,loading,users,updateUser,getAllUsers} = useUserStore();
  const [data,setData] = useState({
    fullName:"",
    email:"",
    role:"",
    password:""
  });
  const {pathname} = useLocation();
  const {id} = useParams();
  const [changedFields, setChangedFields] = useState<Partial<typeof data>>({});
  
  
    if(pathname.includes("edit")){
      const user = users.find(p=>p.id === Number(id));
      if(user && data.fullName === ""){
        setData({
          fullName:user.name,
          email:user.email,
          role:user.role,
          password:""
        })
      }
    }
  const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    try {
      if(pathname.includes("edit")){
        await updateUser(Number(id),changedFields);
      }else{

        await createUser(data.fullName,data.email,data.role,data.password);
      }
      setData({
        fullName:"",
        email:"",
        role:"",
        password:"",
      });
      getAllUsers();      
    } catch (error) {
      console.log("error on creating product")
    }
  }

  return (
      <div className="flex flex-col gap-3 w-full px-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
            <h2 className="font-bold text-xl mb-5">{!pathname.includes("edit")?"add":"update"}  user</h2>
            <div>
              <form className="w-full h-full grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">User Name</Label>
                  <Input 
                    required
                    placeholder="User Name" 
                    className="rounded-xs"
                    value={data.fullName}
                    onChange={(e)=>{
                      setData({...data,fullName:e.target.value})
                      setChangedFields({ ...changedFields, fullName: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">User Role</Label>
                  <Input 
                    required
                    placeholder="User Role" 
                    className="rounded-xs"
                    value={data.role}
                    onChange={(e)=>{
                      setData({...data,role:e.target.value})
                      setChangedFields({ ...changedFields, role: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">User Email</Label>
                  <Input
                    required 
                    placeholder="User Email" 
                    className="rounded-xs"
                    value={data.email}
                    onChange={(e)=>{
                      setData({...data,email:e.target.value})
                      setChangedFields({ ...changedFields, email: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">User Password</Label>
                  <Input
                    required={!pathname.includes("edit")}
                    placeholder="User Password" 
                    className="rounded-xs"
                    value={data.password}
                    onChange={(e)=>{
                      setData({...data,password:e.target.value})
                      setChangedFields({ ...changedFields, password: e.target.value });
                    }}
                  />
                </div>
                  
                <div>
                  <Button className="!rounded-sm">{!pathname.includes("edit")?"add":"update"}</Button>
                </div>
              </form>
            </div>
          </div>
    )
}