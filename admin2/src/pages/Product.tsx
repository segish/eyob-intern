import { Button } from "@/components/ui/button";

import Card from "@/components/Card";
import { Input } from "@/components/ui/input";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "@/store/useProductStore";
import { useEffect } from "react";


export default function Product(){
  const navigate  = useNavigate();
  const {getAllProduct,products,loading,deleteProduct} = useProductStore();
  useEffect(()=>{
    getAllProduct();
  },[getAllProduct]);
  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Products</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm" onClick={()=>navigate("/products/add")}>
          <IconPlus strokeWidth={3} />
          add product
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-6 px-6">
        {products.length >0 ?(
          loading?(
          <p>Loading...</p>
        ):(
          products?.map((product,index)=>(
            <Card 
              name={product.name} 
              description={product.description} 
              image={product.image_url} 
              isFeatured={product.isFeatured} 
              key={index} 
              delte={deleteProduct}
              id={product._id}
              path={"/products/edit/" + product._id}
            />
          ))
        )
        ):(
          <p>No products found</p>
        )}
      </div>
    </div>
  )
}