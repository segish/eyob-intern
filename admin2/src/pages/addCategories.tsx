import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function AddCategoies(){
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const {create ,getAllCategory,updateCategory,categoryList}= useCategoryStore();
  const {id} = useParams();
  const {pathname} = useLocation();


  if(pathname.includes("edit")){
    const category = categoryList.find(c => c._id == id);
    if(category && name === ""){
      setName(category.name);
      setDescription(category.description)
    }
  }





  const handlSubmit= async(e: React.FormEvent)=>{
    e.preventDefault();
    if(pathname.includes("edit")){
      await updateCategory(Number(id),{name,description});
    }else{
      await create(name,description);
    }
    await getAllCategory();
    setName("");
    setDescription("")
  }
  return (
    <div className="flex flex-col gap-3 w-full px-6">
              <h2 className="font-bold text-xl mb-5">Add Category</h2>
              <div>
                <form className="w-full h-full grid grid-cols-2 gap-4 " onSubmit={handlSubmit}>
                  <div className="flex flex-col gap-2 col-span-2">
                    <Label className="font-light text-xs">Category Name</Label>
                    <Input 
                      placeholder="Category Name" 
                      className="rounded-xs"
                      value={name}
                      onChange={(e)=>setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-2">
                    <Label className="font-light text-xs">Category descrption</Label>
                    <Textarea 
                      placeholder="Category descrption" 
                      className="rounded-xs"
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Button className="!rounded-sm">{pathname.includes("edit")?"edit":"add"}</Button>
                  </div>
                </form>
              </div>
            </div>
  )
}