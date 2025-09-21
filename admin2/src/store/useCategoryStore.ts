import {create} from "zustand";
import axios from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export type Category = {
  _id: string;
  name: string;
  description: string;
  message?: string; 
};

type CategoryState = {
  category: Category | null;
  categoryList: Category[];
  loading: boolean;
  create: (name: string, description: string) => Promise<boolean>;
  getAllCategory: () => Promise<void>;
  updateCategory:(id:number,changedFields:Partial<Category>)=> Promise<void>;
  deletedCategory: (id: number) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set) => ({
  category: null,
  categoryList: [],
  loading: false,

  create: async (name, description) => {
    set({ loading: true });
    try {
      const res = await axios.post("/product/catagory/createCatagory", {
        name,
        description,
      });

      const category: Category = {
        _id: res.data._id,
        name: res.data.name,
        description: res.data.description,
        message: res.data.message,
      };

      toast.success(category.message || "Category created!");
      set({ category, loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
      return false;
    }
  },

  getAllCategory: async () => {
    set({ loading: true });
    try {
      const res = await axios.get<{ category: Category[] }>(
        "/product/catagory/getCatagory"
      );

      set({
        categoryList: res.data.category.map((cat) => ({
          _id: cat._id,
          name: cat.name,
          description: cat.description,
        })),
        loading: false,
      });
      toast.success("Categories fetched successfully");
    } catch (error) {
      set({ loading: false });
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    }
  },
  updateCategory: async (id:number, changedFields: Partial<Category>) => {
    set({ loading: true });
    try {
      const res = await axios.post(`/product/catagory/editCatagory/${id}`, {
        ...changedFields,
      });
      toast.success(res.data.message || "Category updated successfully");
      set((state: CategoryState) => ({
        categoryList: state.categoryList.map((cat) =>
          cat._id === String(id) ? { ...cat, ...changedFields } : cat
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  },
  deletedCategory: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/product/catagory/deleteCatagory/${id}`);
      toast.success(res.data.message);
      set((state: CategoryState) => ({
        categoryList: state.categoryList.filter((cat) => cat._id !== String(id)),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
}}));
