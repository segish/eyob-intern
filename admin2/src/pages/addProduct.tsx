import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue ,SelectContent} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useProductStore } from "@/store/useProductStore";
import {useEffect, useRef, useState} from "react"
import { useLocation, useParams } from "react-router-dom";


export default function AddProduct(){
  const {categoryList,getAllCategory,loading} = useCategoryStore();
  const {
    createProduct,
    loading:productLoding,
    products,updateProduct} = useProductStore();

  const imageRef = useRef<HTMLInputElement | null>(null);
  const bannerImageRef = useRef<HTMLInputElement | null>(null);

  const {id} = useParams();
  const {pathname} = useLocation();


  useEffect(()=>{
    getAllCategory()
  },[getAllCategory])

  const [data,setData] = useState({
    name:"",
    description:"",
    detail:"",
    image:"",
    bannerImage:"",
    isFeatured:false,
    category:""
  });
  const [changedFields, setChangedFields] = useState<Partial<typeof data>>({});
  if(pathname.includes("edit")){
    const product = products.find(p=>p._id === Number(id));
    if(product && data.name === ""){
      setData({
        name:product.name,
        description:product.description,
        detail:product.detail,
        image:product.image_url,
        bannerImage:product.banner_image_url,
        isFeatured:product.isFeatured,
        category:product.catagory
      })
    }
  }
  


  const handleSubmit= async (e:React.FormEvent)=>{
    e.preventDefault();
    try {
      if(pathname.includes("edit")){
        await updateProduct(Number(id),changedFields)
      }else{

        await createProduct(data.name,data.description,data.detail,data.image,data.bannerImage,data.category,data.isFeatured);
      }
      setData({
        name:"",
        description:"",
        detail:"",
        image:"",
        bannerImage:"",
        isFeatured:false,
        category:""
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
      {productLoding && (
        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}
          <h2 className="font-bold text-xl mb-5">Add products</h2>
          <div>
            <form className="w-full h-full grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label className="font-light text-xs">Product Name</Label>
                <Input 
                  placeholder="Product Name" 
                  className="rounded-xs"
                  value={data.name}
                  onChange={(e)=>{
                    setData({...data,name:e.target.value})
                    setChangedFields({ ...changedFields, name: e.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-light text-xs">Product category</Label>
                <div className="w-full border-2">
                   <Select
                    value={!pathname.includes("edit")?"":data.category}  
                    onValueChange={(value)=>{
                      setData({...data,category:value})
                      setChangedFields({ ...changedFields, category: value })
                    }}>
                    <SelectTrigger className="w-full !bg-transparent !border-none hover:!border-none focus:!border-none placeholder:!font-normal">
                      <SelectValue placeholder="Categories" />
                    </SelectTrigger>
                    <SelectContent>
                     {loading ? (
                        <p>Loading...</p>
                      ) : (
                        categoryList.map((cat)=>(
                        <SelectItem value={cat.name} key={cat.name}>{cat.name}</SelectItem>
                        ))
                      )
                    }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label className="font-light text-xs">Product descrption</Label>
                <Textarea 
                  placeholder="Product descrption" 
                  className="rounded-xs"
                  value={data.description}
                  onChange={(e)=>{
                    setData({...data,description:e.target.value})
                    setChangedFields({ ...changedFields, description: e.target.value})
                }}
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label className="font-light text-xs">Product detail</Label>
                <Textarea 
                  placeholder="Product detail" 
                  className="rounded-xs"
                  value={data.detail}
                  onChange={(e)=>{
                    setData({...data,detail:e.target.value})
                    setChangedFields({ ...changedFields, detail: e.target.value})
                  }}
                  />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-light text-xs">Product image</Label>
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
                <Label className="font-light text-xs">Product banner image</Label>
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
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={data.isFeatured}
                  onChange={(e)=>{
                    setData({...data,isFeatured: e.target.checked})
                    setChangedFields({ ...changedFields, isFeatured: e.target.checked})
                  }}
                />
                <Label className="font-light text-xs">Product make it featured</Label>
              </div>
              <div>
                <Button className="!rounded-sm">{!pathname.includes("edit")?"add":"update"}</Button>
              </div>
            </form>
          </div>
        </div>
  )
}