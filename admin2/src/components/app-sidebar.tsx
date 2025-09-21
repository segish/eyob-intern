import * as React from "react"
import {
  ChartBarStacked,
  Handshake,
  LayoutDashboard,
  Mail,
  Newspaper,
  Quote,
  Settings,
  ShoppingCart,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
// import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/store/useUserStore"

type Role ={
 title: string;
  url: string;
  icon: LucideIcon;
}

const productManager: Role[] = [
{
    title: "Products",
    url: "/products",
    icon: ShoppingCart,
  },
  {
    title: "Product Categories",
    url: "/categories",
    icon: ChartBarStacked,
  },
];
const serviceManager :Role[] =[
{
    title: "Services",
    url: "/services",
    icon: Wrench,
  }
];

const socialManager:Role[] = [
  {
    title: "News and Events",
    url: "/events",
    icon: Newspaper,
  },
  {
    title: "Testimonials",
    url: "/testimonials",
    icon: Quote,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: Mail,

  },
]
const admin :Role[]= [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  ...productManager,
  ...serviceManager,
  ...socialManager,

  {
    title: "Users",
    url: "/users",
    icon: User,
  },
  {
    title: "Partners",
    url: "/partners",
    icon: Handshake,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
type RoleKey = "admin" | "productManager" | "serviceManager" | "socialManager";
function menu(role: RoleKey) {
  const roleCollection: Record<RoleKey, Role[]> = {
    admin,
    productManager,
    serviceManager,
    socialManager,
  };

  return roleCollection[role];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useUserStore();
  if (!user) {
    return;
  }
  const item = menu(user?.role as RoleKey)

  const userData: { name: string; email: string } = {
    name: user.name,
    email: user.email,
  };
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="text-sidebar-primary-foreground flex aspect-square size-15 items-center justify-center rounded-lg">
                  {/* <Command className="size-4" /> */}
                  <img src="/svgviewer-output.svg" alt="img" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight text-black">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={item} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
