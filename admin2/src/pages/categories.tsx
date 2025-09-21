
import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DataTable } from "@/components/data-table"; // adjust path
import { useCategoryStore } from "@/store/useCategoryStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const schema = z.object({
  id: z.string(),
  _id: z.string(),
  name: z.string(),
  description: z.string(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <p className="truncate w-40">{row.original.id}</p>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="truncate w-64">{row.original.description}</p>
    ),
  },
  {
    accessorKey:"id",
    header: "Actions",
    id: "actions",
    cell: ({row}) => {
      const navigate = useNavigate();
      const { deletedCategory } = useCategoryStore();
      return (
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
            <Button
            className="!bg-white !text-black" 
            onClick={() => {
              navigate(`/categories/edit/${row.original.id}`);
              console.log(row.original.id);
              }}>
                <Pencil fill="green"/>
                Edit
           </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Button
            className="!bg-white !text-black" 
            onClick={() => {
              deletedCategory(Number(row.original.id));
              }}
            >
              <Trash  fill="red"/> Delete 
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    },
  },
];

export default function CategoryTable() {
  const navigate  = useNavigate();
  
  const { categoryList, getAllCategory, loading } = useCategoryStore();

  React.useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="px-5 font-bold !text-xl">Category</h1>

      <div className="flex justify-between px-6">
        <Input type="search" className="w-50 rounded-sm" placeholder="search" />
        <Button className="!rounded-sm" onClick={()=>navigate("/categories/add")}>
          <IconPlus strokeWidth={3} />
          add category
        </Button>
      </div>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <DataTable
          data={categoryList.map((cat) => ({ ...cat, id: cat._id }))}
          columns={columns}
        />
      )}
    </div>
  );
}
