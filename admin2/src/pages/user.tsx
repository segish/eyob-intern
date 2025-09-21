import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { Pencil, Trash } from "lucide-react";
import z from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
// const data = [
//   {
//   "id":1,
//   "fullName":"medicine",
//   "email":"hgiagifafafcfuafaadd",
//   "role":"admin"
//   },
//   {
//   "id":2,
//   "fullName":"medicine",
//   "email":"hgiagifafafcfuafaadd",
//   "role":"admin"
//   },

// ]
export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role:z.string()
});
const columns: ColumnDef<z.infer<typeof schema>>[] = [
   {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <p>{row.original.id}</p>
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div>
        {row.original.role}

      </div>
    ),
  },
  {
    accessorKey:"id",
    header: "Actions",
    id: "actions",
    cell: ({row}) => {
      const navigate = useNavigate();
       const { deleteUser} = useUserStore();
      return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 !bg-white"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>
            <Button className="!bg-white !text-black" 
            onClick={() => {
              navigate(`/users/edit/${row.original.id}`);
              }}>
              <Pencil fill="green"/>Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Button className="!bg-white !text-black" 
            onClick={() => {
              deleteUser(Number(row.original.id));
              }}>
              <Trash  fill="red"/> Delete 
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    }
  },
]

export default function User(){
  const {getAllUsers,users,loading} = useUserStore(); 
  const navigate = useNavigate();
  useEffect(()=>{
    getAllUsers()
  },[getAllUsers]);
  return (
     <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Users</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm" onClick={()=>navigate("/users/add")}>
          <IconPlus strokeWidth={3} />
          add User
        </Button>
      </div>
      {loading?<p>Loding...</p>: <DataTable data={users} columns={columns}/>}
    </div>
  )
}