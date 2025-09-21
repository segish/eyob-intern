import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettingStore } from "@/store/useSettingStore";
import { useEffect, useState } from "react";

export default function Settings() {
  const {setting,getSetting,updatedSetting,loading} = useSettingStore();

  useEffect(()=>{
    getSetting();
  },[getSetting])

  const [data,setData] = useState({
    phone_primary:setting?.phone_primary,
    phone_secondary:setting?.phone_secondary,
    address:setting?.address,
    google_map_url:setting?.google_map_url,
    email:setting?.email,
    facebook_url:setting?.facebook_url,
    instagram_url:setting?.instagram_url,
    twitter_url:setting?.twitter_url ,
    tictok_url:setting?.tictok_url,
  });

  const handelSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();
    await updatedSetting(data);
  }
  return (
    <div className="py-10 pr-6 flex flex-col gap-3 w-full relative">
      {loading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
      <h1 className="px-5 font-bold !text-xl">Settings</h1>
      
      <div className="w-full flex flex-col gap-3 px-6">
        <h2>Business Setup</h2>
        <Separator/>
        <form className="w-full h-full grid grid-cols-2 gap-4" onSubmit={handelSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Address</Label>
            <Input 
              placeholder="Address" 
              className="rounded-xs"
              value={data.address}
              onChange={(e)=>setData({...data,address:e.target.value})}

            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Email</Label>
            <Input 
              placeholder="Email" 
              type="email" 
              className="rounded-xs"
              value={data.email}
              onChange={(e)=>setData({...data,email:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Phone 1</Label>
            <Input 
              placeholder="Phone Number" 
              className="rounded-xs"
              value={data.phone_primary}
              onChange={(e)=>setData({...data,phone_primary:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Phone 2</Label>
            <Input 
              placeholder="Address" 
              className="rounded-xs"
              value={data.phone_secondary}
              onChange={(e)=>setData({...data,phone_secondary:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Telegram Link</Label>
            <Input placeholder="Telegram Link" className="rounded-xs"/>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Facebook Link</Label>
            <Input 
              placeholder="Facebook Link" 
              className="rounded-xs"
              value={data.facebook_url}
              onChange={(e)=>setData({...data,facebook_url:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Tictoke Link</Label>
            <Input 
              placeholder="Telegram Link" 
              className="rounded-xs"
              value={data.tictok_url}
              onChange={(e)=>setData({...data,tictok_url:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Instagram Link</Label>
            <Input 
              placeholder="Instagram Link" 
              className="rounded-xs"
              value={data.instagram_url}
              onChange={(e)=>setData({...data,instagram_url:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-light text-xs">Twitter Link</Label>
            <Input 
              placeholder="Twitter Link" 
              className="rounded-xs"
              value={data.twitter_url}
              onChange={(e)=>setData({...data,twitter_url:e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <Label className="font-light text-xs">Head Office Gmap Absolute URL</Label>
            <Input 
              placeholder="URL" 
              className="rounded-xs"
              value={data.google_map_url}
              onChange={(e)=>setData({...data,google_map_url:e.target.value})}
            />
          </div>
          <div>
            <Button className="!rounded-sm">update</Button>
          </div>
        </form>
      </div>
    </div>
  )
}