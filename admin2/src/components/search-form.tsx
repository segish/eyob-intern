import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import { SidebarInput } from "@/components/ui/sidebar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const searchPathList = ["/","/products","/categories","/users","/messages","/services","/events","/testimonials","/partners","settings"]
  const [search,setSearch] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matchedPath = searchPathList.find(path =>
      path.toLowerCase().includes(search.toLowerCase())
    );

    if (matchedPath) {
      navigate(matchedPath);
    } else {
      alert("Path not found");
    }
  };

  return (
    <form {...props} onSubmit={(e)=>{
      e.preventDefault();
      handleSubmit(e)
    }}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7"
          value={search}
          onChange={(e)=>{
            setSearch(e.target.value)
          }}
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  )
}
