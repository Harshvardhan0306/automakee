
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface AdminDateRangeSelectorProps {
  dateRange: string;
  setDateRange: (range: string) => void;
}

const AdminDateRangeSelector = ({ dateRange, setDateRange }: AdminDateRangeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Today">Today</SelectItem>
          <SelectItem value="Yesterday">Yesterday</SelectItem>
          <SelectItem value="This week">This week</SelectItem>
          <SelectItem value="This month">This month</SelectItem>
          <SelectItem value="Last month">Last month</SelectItem>
          <SelectItem value="This year">This year</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon">
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminDateRangeSelector;
