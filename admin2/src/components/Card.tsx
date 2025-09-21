import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { Pencil, Star, Trash } from "lucide-react"
import { useNavigate } from "react-router-dom";


export default function Card({name,description,image,isFeatured,delte,id,path}:{
  name?:string,
  description?:string,
  image?:string,
  isFeatured?:boolean,
  delte?:(id:Number)=>  Promise<void>;
  id:number,
  path:string
}) {
  return (
    <div className="w-full h-[275px] relative rounded-xs overflow-hidden">
      <Dropmenu isFeatured={isFeatured} delte={delte} id={id} path={path}/>
      <div className="absolute top-0 left-0 w-full h-full z-3 bg-black opacity-40"></div>
      <img src={image} alt="" className="object-cover absolute top-0 left-0 w-full h-full z-1" />
      <div className="relative z-10 w-full h-full p-4 flex items-center">
        <div className="pt-5 w-full">
          <h2 className="text-4xl text-white font-bold">{name}</h2>
          <p className="text-white text-xs mt-4">
              {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function Dropmenu({isFeatured,delte,id,path}:{isFeatured?:boolean, delte?:(id:Number)=>  Promise<void>;
  id:number,path:string}){
    const navigate = useNavigate();
  return (
    <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 !bg-transparent absolute top-4 right-4 z-20"
            size="icon"
          >
            <IconDotsVertical className="text-white font-bold" strokeWidth={3} />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={()=>{
            navigate(path)
          }}><Pencil fill="black"/>Edit</DropdownMenuItem>
          <DropdownMenuItem><Star fill={isFeatured?"yellow":"black"}/>make fetured</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Button
              variant="outline"
              className="!bg-white"
              onClick={async () =>
                await delte?.(id)
              }
            >
              <Trash fill="red" strokeWidth={1}/> Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

