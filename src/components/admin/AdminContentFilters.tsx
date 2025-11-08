
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface AdminContentFiltersProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const AdminContentFilters = ({ filterStatus, setFilterStatus }: AdminContentFiltersProps) => {
  return (
    <div className="flex gap-3">
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Status</SelectItem>
          <SelectItem value="Published">Published</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AdminContentFilters;
