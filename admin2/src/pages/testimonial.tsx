import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTestimonialStore } from "@/store/useTestimonialStore";
import {  IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Testimonials(){
  const {getAllTestimonials,loading,testimonials,deteleTestimonial} =useTestimonialStore();
  const navigate = useNavigate();

  useEffect(()=>{
    getAllTestimonials();
  },[getAllTestimonials])
  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Testimonials</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm"
        onClick={()=>navigate("/testimonials/add")}>
          <IconPlus strokeWidth={3} />
          add testimonials
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-6 px-6">
        {testimonials.length >0 ?(
                  loading?(
                    <p>Loading...</p>
                  ):(
                    testimonials?.map((testimonial,index)=>(
                      <Card 
                        name={testimonial.name} 
                        description={testimonial.message} 
                        image={testimonial.photo_url} 
                        isFeatured={false} 
                        key={index} 
                        delte={deteleTestimonial}
                        id={testimonial._id}
                        path={"/testimonials/edit/" + testimonial._id}
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