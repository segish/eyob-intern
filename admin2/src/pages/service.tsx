import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServiceStore } from "@/store/useServiceStore";
import {  IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";


export default function Service(){
  const {getAllServices,loading,services,deleteService} = useServiceStore();
  const navigate  = useNavigate();
  
  useEffect(()=>{
    getAllServices();
  },[getAllServices])
  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Services</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm" onClick={()=>navigate("/services/add")}>
          <IconPlus strokeWidth={3} />
          add services
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-6 px-6">
        {services.length >0 ?(
          loading?(
            <p>Loading...</p>
          ):(
            services?.map((service,index)=>(
              <Card 
                name={service.title} 
                description={service.description} 
                image={service.image_url} 
                isFeatured={false} 
                key={index} 
                delte={deleteService}
                id={service._id}
                path={"/services/edit/" + service._id}
              />
            ))
           )
          ):(
          <p>No services found</p>
        )}
      </div>
    </div>
  )
}