import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEventStore } from "@/store/useEvenetStrore";
import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function AddEvent(){
  const {createEvent,loading,events,updateEvent} = useEventStore();
  const [data,setData] = useState({
    title:"",
    content:"",
    detail:"",
    image:"",
    bannerImage:""
  });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const bannerImageRef = useRef<HTMLInputElement | null>(null);
  const {pathname} = useLocation();
  const {id} = useParams();
  const [changedFields, setChangedFields] = useState<Partial<typeof data>>({});
  
  
    if(pathname.includes("edit")){
      const event = events.find(p=>p._id === Number(id));
      if(event && data.title === ""){
        setData({
          title:event.title,
          content:event.content,
          detail:event.detail,
          image:event.image_url,
          bannerImage:event.banner_image_url,
        })
      }
      console.log("event",event?.banner_image_url)
    }
  const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    try {
      if(pathname.includes("edit")){
        await updateEvent(Number(id),changedFields);
      }else{

        await createEvent(data.title,data.content,data.detail,data.image,data.bannerImage);
      }
      setData({
        title:"",
        content:"",
        detail:"",
        image:"",
        bannerImage:"",
      });

      if (imageRef.current) imageRef.current.value = "";
      if (bannerImageRef.current) bannerImageRef.current.value = "";
      
    } catch (error) {
      console.log("error on creating product")
    }
  }
  const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>, key: "image" | "bannerImage")=>{
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
            <h2 className="font-bold text-xl mb-5">{!pathname.includes("edit")?"add":"update"} Event</h2>
            <div>
              <form className="w-full h-full grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">Event Name</Label>
                  <Input 
                    placeholder="Event Name" 
                    className="rounded-xs"
                    value={data.title}
                    onChange={(e)=>{
                      setData({...data,title:e.target.value})
                      setChangedFields({ ...changedFields, title: e.target.value });
                    }}
                  />
                </div>
                
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="font-light text-xs">Event content</Label>
                  <Textarea 
                    placeholder="Event content" 
                    className="rounded-xs"
                    value={data.content}
                    onChange={(e)=>{
                      setData({...data,content:e.target.value})
                      setChangedFields({ ...changedFields, content: e.target.value})
                  }}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="font-light text-xs">Event detail</Label>
                  <Textarea 
                    placeholder="Event detail" 
                    className="rounded-xs"
                    value={data.detail}
                    onChange={(e)=>{
                      setData({...data,detail:e.target.value})
                      setChangedFields({ ...changedFields, detail: e.target.value})
                    }}
                    />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">Event image</Label>
                  <Input 
                    ref={imageRef}
                    className="rounded-xs" 
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(e) => {
                      handleImageChange(e, "image");
                    }}
                  />
                  {data.image && <img src={data.image} alt="preview" width={100} />}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-light text-xs">Event banner image</Label>
                  <Input
                    ref={bannerImageRef} 
                    className="rounded-xs" 
                    type="file"
                    accept="image/*"
                    name="bannerImage"
                    onChange={(e) => handleImageChange(e, "bannerImage")} 
                  />
                  {data.bannerImage && <img src={data.bannerImage} alt="preview" width={100} />}
                </div>  
                <div>
                  <Button className="!rounded-sm">{!pathname.includes("edit")?"add":"update"}</Button>
                </div>
              </form>
            </div>
          </div>
    )
}