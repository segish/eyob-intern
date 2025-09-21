import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTestimonialStore } from "@/store/useTestimonialStore";
import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function AddTestimonial(){
  const {createTestimonial,loading,testimonials,updateTestimonial} = useTestimonialStore();
  const [data,setData] = useState({
    name:"",
    message:"",
    designation:"",
    photo:"",
  });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const {pathname} = useLocation();
  const {id} = useParams();
  const [changedFields, setChangedFields] = useState<Partial<typeof data>>({});
  
  
    if(pathname.includes("edit")){
      const testimonial = testimonials.find(p=>p._id === Number(id));
      if(testimonial && data.name === ""){
        setData({
          name:testimonial.name,
          message:testimonial.message,
          designation:testimonial.designation,
          photo:testimonial.photo_url,
        })
      }
    }
  const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    try {
      if(pathname.includes("edit")){
        await updateTestimonial(Number(id),changedFields);
      }else{
        await createTestimonial(data.name,data.designation,data.message,data.photo);
      }
      setData({
        name:"",
        message:"",
        designation:"",
        photo:"",
      });

      if (imageRef.current) imageRef.current.value = "";
      
    } catch (error) {
      console.log("error on creating product")
    }
  }
  const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>, key: "photo")=>{
    const file = e.target.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = ()=>{
        setData({...data,[key]:reader.result as string})
        setChangedFields({ ...changedFields, [key]: reader.result as string });
      }
      reader.readAsDataURL(file);
    }
  }
  return (
      <div className="flex flex-col gap-3 w-full px-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
            <h2 className="font-bold text-xl mb-5">{!pathname.includes("edit")?"add":"update"} Testimonial</h2>
            <div>
              <form className="w-full h-full grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">Name</Label>
                  <Input 
                    placeholder="Name" 
                    className="rounded-xs"
                    value={data.name}
                    required
                    onChange={(e)=>{
                      setData({...data,name:e.target.value})
                      setChangedFields({ ...changedFields, name: e.target.value });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">Designation</Label>
                  <Input 
                    placeholder="Designation" 
                    className="rounded-xs"
                    value={data.designation}
                    onChange={(e)=>{
                      setData({...data,designation:e.target.value})
                      setChangedFields({ ...changedFields, designation: e.target.value });
                    }}
                  />
                </div>
                
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="font-light text-xs">Message</Label>
                  <Textarea 
                    placeholder="Message" 
                    className="rounded-xs"
                    required
                    value={data.message}
                    onChange={(e)=>{
                      setData({...data,message:e.target.value})
                      setChangedFields({ ...changedFields, message: e.target.value})
                  }}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="font-light text-xs">Photo</Label>
                  <Input 
                    ref={imageRef}
                    className="rounded-xs" 
                    type="file"
                    accept="image/*"
                    required
                    name="image"
                    onChange={(e) => {
                      handleImageChange(e, "photo");
                    }}
                  />
                  {data.photo && <img src={data.photo} alt="preview" width={100} />}
                </div>  
                <div>
                  <Button className="!rounded-sm">{!pathname.includes("edit")?"add":"update"}</Button>
                </div>
              </form>
            </div>
          </div>
    )
}