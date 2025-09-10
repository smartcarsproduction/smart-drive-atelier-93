import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Car,
  Settings,
  TrendingUp,
  Layout,
  Cog,
  Monitor,
  FileText,
  Shield
} from "lucide-react";

const adminMenuItems = [
  {
    category: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
      { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
      { title: "System Status", url: "/admin/system", icon: Monitor },
    ]
  },
  {
    category: "Business Management",
    items: [
      { title: "Customers", url: "/admin/customers", icon: Users },
      { title: "Bookings", url: "/admin/bookings", icon: Calendar },
      { title: "Services", url: "/admin/services", icon: Car },
    ]
  },
  {
    category: "Content & Website",
    items: [
      { title: "Content Management", url: "/admin/content", icon: Layout },
      { title: "Media Library", url: "/admin/media", icon: FileText },
    ]
  },
  {
    category: "System Administration",
    items: [
      { title: "Security", url: "/admin/security", icon: Shield },
      { title: "Settings", url: "/admin/settings", icon: Cog },
    ]
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string, exact?: boolean) => {
    const active = isActive(path, exact);
    return active 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "text-muted-foreground hover:text-primary hover:bg-muted/50";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <div className="p-4 border-b">
        {!collapsed && (
          <h2 className="font-luxury text-lg font-bold text-primary">Admin Portal</h2>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      <SidebarContent className="px-2">
        {adminMenuItems.map((category) => (
          <SidebarGroup key={category.category}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category.category}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => {
                  const active = isActive(item.url, item.exact);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <NavLink 
                          to={item.url} 
                          className={getNavClasses(item.url, item.exact)}
                          title={collapsed ? item.title : undefined}
                        >
                          <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}