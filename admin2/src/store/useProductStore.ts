import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";



type Product = {
  _id: number;
  name:string;
  description: string;
  detail: string;
  image: string;
  bannerImage: string;
  catagory: string;
  isFeatured:boolean;
  image_url:string;
  banner_image_url:string;
}

interface ProductStoreState {
  products: Product[];
  setProduct: (products: Product[]) => void;
  loading: boolean;
  createProduct: (name:string,
  description: string,
  detail: string,
  image: string,
  bannerImage: string,
  catagory: string,
  isFeatured:boolean) => Promise<boolean>;
  getAllProduct:()=>  Promise<void>;
  deleteProduct:(id:Number)=>  Promise<void>;
  updateProduct:(
    id:number,
    changedFields:Partial<Product>
  )=> Promise<void>;
}

export const useProductStore = create<ProductStoreState>((set)=>({
  products:[] as Product[],
  setProduct:(products: Product[])=>set({products}),
  loading:false,
  createProduct: async (name,description,detail,image,bannerImage,catagory,isFeatured) =>{
    set({loading:true});
    try {
      const res = await axios.post("/product/create",{
        name,
        description,
        detail,
        image,
        bannerImage,
        catagory,
        isFeatured
      });
      toast.success(res.data.message || "Product created successfully");
      set((state: ProductStoreState)=>({products:[...state.products,res.data.product]}));
      set({loading:false});
      return true;
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      return false;
    }
  },
  getAllProduct: async()=>{
    set({loading:true});
    try {
      const res = await axios.get("/product");

      set({products:res.data.products,loading:false});
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  updateProduct:async (id,changedFields:Partial<Product>)=>{
    set({loading:true});
    try {
      const res = await axios.post(`/product/edit/${id}`,{
        ...changedFields
      });
      toast.success(res.data.message || "Product updated successfully");
      set((state: ProductStoreState)=>({products:[...state.products,res.data.product]}));
      set({loading:false});


    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deleteProduct: async (id) =>{
    set({loading:true});
    try {
      await axios.delete("/product/"+id);
      set((state: ProductStoreState)=>({products:state.products.filter(product=>product._id !== id),loading:false}));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({loading:false});
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  }
  

}))
