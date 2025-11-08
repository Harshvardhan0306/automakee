
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  Search, 
  BellRing, 
  Settings
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ContactSubmission } from "@/context/AdminContext";

interface AdminHeaderProps {
  toggleSidebar: () => void;
  contacts: ContactSubmission[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleLogout: () => void;
  getTimeAgo: (date: Date) => string;
}

const AdminHeader = ({
  toggleSidebar,
  contacts,
  searchTerm,
  setSearchTerm,
  handleLogout,
  getTimeAgo
}: AdminHeaderProps) => {
  return (
    <header className="bg-card p-4 shadow-sm border-b border-border/50 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-medium">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64 max-w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..." 
              className="pl-8 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <BellRing className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                  {contacts.length > 0 ? Math.min(contacts.length, 9) : 0}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {contacts.slice(0, 3).map((contact, i) => (
                <DropdownMenuItem key={i} className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">New contact form submission</p>
                    <p className="text-xs text-muted-foreground">{contact.name} just submitted a contact form</p>
                    <p className="text-xs text-muted-foreground">{getTimeAgo(new Date(contact.created_at))}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              {contacts.length === 0 && (
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground">No new notifications</p>
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
