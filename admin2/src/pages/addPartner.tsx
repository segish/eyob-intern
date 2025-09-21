import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePartnerStore } from "@/store/usePartnerStore";
import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function AddPartner(){
  const {createPartner,loading,partners,updatePartner} = usePartnerStore();
  const [data,setData] = useState({
    name:"",
    image:"",
  });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const {pathname} = useLocation();
  const {id} = useParams();
  const [changedFields, setChangedFields] = useState<Partial<typeof data>>({});
  
  
    if(pathname.includes("edit")){
      const partner = partners.find(p=>p._id === Number(id));
      if(partner && data.name === ""){
        setData({
          name:partner.name,
          image:partner.image_url,
        })
      }
    }
  const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    try {
      if(pathname.includes("edit")){
        await updatePartner(Number(id),changedFields);
      }else{

        await createPartner(data.name,data.image);
      }
      setData({
        name:"",
        image:""
      });

      if (imageRef.current) imageRef.current.value = "";      
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
            <h2 className="font-bold text-xl mb-5">{!pathname.includes("edit")?"add":"update"} Partner</h2>
            <div>
              <form className="w-full h-full grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="font-light text-xs">Partner Name</Label>
                  <Input
                    required 
                    placeholder="Partner Name" 
                    className="rounded-xs"
                    value={data.name}
                    onChange={(e)=>{
                      setData({...data,name:e.target.value})
                      setChangedFields({ ...changedFields, name: e.target.value });
                    }}
                  />
                </div>
                
                
                
                <div className="flex flex-col gap-2 col-span-2">
                  <Label className="font-light text-xs">Partner image</Label>
                  <Input
                    required={!pathname.includes("edit")} 
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
                
                <div>
                  <Button className="!rounded-sm">{!pathname.includes("edit")?"add":"update"}</Button>
                </div>
              </form>
            </div>
          </div>
    )
}