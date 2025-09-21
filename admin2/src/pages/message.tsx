import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconDotsVertical} from "@tabler/icons-react";
import { Trash } from "lucide-react";
import z from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect } from "react";
// const data = [
//   {
//   "id":1,
//   "name":"medicine",
//   "email":"hgiagifafafcfuafaadd",
//   "phoneNumber":"808080",
//   "message":"hhciagugcuafyfaydddtdtd"
//   },
//   {
//   "id":2,
//   "name":"medicine",
//   "email":"hgiagifafafcfuafaadd",
//   "phoneNumber":"909090909",
//   "message":"hgacafsaddadrdrd"
//   },


// ]
export const schema = z.object({
  _id:z.string(),
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phoneNumber:z.string(),
  message:z.string()
});
const columns: ColumnDef<z.infer<typeof schema>>[] = [
   {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => {
      return <p>{row.original._id}</p>
    },
    enableHiding: false,
  },
   {
    accessorKey: "name",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="w-32">
        <p>
          {row.original.name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div>
        {row.original.email}

      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div>
        {row.original.phoneNumber}

      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div>
        {row.original.message}

      </div>
    ),
  },
  {
    accessorKey:"_id",
    header: "Actions",
    id: "actions",
    cell: ({row}) =>{
      const { deleteMessage } = useMessageStore();
      return  (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 !bg-white"
            size="icon"
          >
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem variant="destructive">
            <Button variant="ghost" className="w-full flex items-center gap-2 !bg-white !text-black" onClick={()=>deleteMessage(Number(row.original._id))}>
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    }
  },
]

export default function Message(){
  const {messages,loading,getAllMessages} = useMessageStore();
  useEffect(()=>{
    getAllMessages();
  },[getAllMessages])
  return (
     <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Messages</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
      </div>
      {loading ? <div>Loading...</div> :
      <DataTable<z.infer<typeof schema>>
        columns={columns}
        data={messages.map((msg) => ({
          ...msg,
          _id: String(msg._id),
          id: String(msg._id),
        }))}
      />
      }
    </div>
  )
}