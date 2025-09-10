import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Header */}
          <header className="h-14 sm:h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 sm:px-6 h-full">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <SidebarTrigger />
                <div className="min-w-0">
                  <h1 className="font-luxury text-lg sm:text-xl font-bold text-primary truncate">Smart Cars Elite</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Administration Panel</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}