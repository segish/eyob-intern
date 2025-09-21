import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartnerStore } from "@/store/usePartnerStore";
import {  IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Partners(){

  const {getAllPartners,loading,partners,deletePartner} = usePartnerStore();
  const navigate  = useNavigate();
  useEffect(()=>{
    getAllPartners()
  },[getAllPartners])
  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Partners</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm"
        onClick={()=>navigate("/partners/add")}>
          <IconPlus strokeWidth={3} />
          add partners
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-6 px-6">
        {partners.length >0 ?(
                  loading?(
                    <p>Loading...</p>
                  ):(
                    partners?.map((partner,index)=>(
                      <Card 
                        name={partner.name} 
                        description={""} 
                        image={partner.image_url} 
                        isFeatured={false} 
                        key={index} 
                        delte={deletePartner}
                        id={partner._id}
                        path={"/partners/edit/" + partner._id}
                      />
                    ))
                   )
                  ):(
                  <p>No partner found</p>
                )}
      </div>
    </div>
  )
}