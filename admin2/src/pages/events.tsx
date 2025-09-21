import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEvenetStrore";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Events(){
  const {getAllEvents,loading,events,deleteEvent} = useEventStore();

  const navigate = useNavigate();

  useEffect(()=>{
    getAllEvents();
  },[getAllEvents])

  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Events</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm" onClick={()=>navigate("/events/add")}>
          <IconPlus strokeWidth={3} />
          add events
        </Button>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-6 px-6">
        {events.length >0 ?(
                  loading?(
                    <p>Loading...</p>
                  ):(
                    events?.map((event,index)=>(
                      <Card 
                        name={event.title} 
                        description={event.content} 
                        image={event.image_url} 
                        isFeatured={false} 
                        key={index} 
                        delte={deleteEvent}
                        id={event._id}
                        path={"/events/edit/" + event._id}
                      />
                    ))
                   )
                  ):(
                  <p>No event found</p>
                )}
      </div>
    </div>
  )
}