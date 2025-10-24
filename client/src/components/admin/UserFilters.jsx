import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const UserFilters = ({ onFilterChange, onSearch, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    onFilterChange({ status: value });
  };
  
  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    onFilterChange({ status: "all" });
    onSearch("");
  };
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <form onSubmit={handleSearchSubmit} className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by username or email..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0"
            disabled={loading || !searchQuery}
          >
            Search
          </Button>
        </form>
        
        <div>
          <Select value={statusFilter} onValueChange={handleStatusChange} disabled={loading}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center justify-center" 
          onClick={handleReset}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;