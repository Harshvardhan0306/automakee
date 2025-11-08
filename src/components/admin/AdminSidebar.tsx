
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Home,
  Settings,
  LogOut,
  X,
  FileText,
  MessageSquare,
  BellRing
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

interface MenuItemProps {
  icon: ReactNode;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

const MenuItem = ({ icon, name, active, onClick }: MenuItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton 
      isActive={active} 
      onClick={onClick}
      tooltip={name}
    >
      {icon}
      <span>{name}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const AdminSidebar = ({
  sidebarOpen,
  toggleSidebar,
  handleLogout
}: AdminSidebarProps) => {
  return (
    <Sidebar
      data-state={sidebarOpen ? "expanded" : "collapsed"}
      className="z-30 shadow-lg border-r border-border/50"
    >
      <SidebarHeader className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Automake</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MAIN MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem
                icon={<Home className="h-5 w-5" />}
                name="Dashboard"
                active={true}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem
                icon={<Settings className="h-5 w-5" />}
                name="Settings"
              />
              <MenuItem
                icon={<MessageSquare className="h-5 w-5" />}
                name="Integrations"
              />
              <MenuItem
                icon={<BellRing className="h-5 w-5" />}
                name="Notifications"
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@automake.com</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
