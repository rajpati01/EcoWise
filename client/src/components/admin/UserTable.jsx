import React from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const UserTable = ({ 
  users, 
  loading, 
  onSort, 
  sortField, 
  sortOrder,
  onViewUser, 
  onDeleteUser,
  page,
  pageSize,
  totalUsers,
  onPageChange
}) => {
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === 'asc' ? 
      <ArrowUpDown className="ml-2 h-4 w-4 text-primary" /> : 
      <ArrowUpDown className="ml-2 h-4 w-4 text-primary rotate-180" />;
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const getActivityLabel = (count) => {
    if (count >= 20) return { label: "High", color: "bg-green-100 text-green-800" };
    if (count >= 5) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Low", color: "bg-red-100 text-red-800" };
  };

  if (loading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No users found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                #
              </TableHead>
              <TableHead onClick={() => handleSort('username')} className="cursor-pointer">
                <div className="flex items-center">
                  Username {renderSortIcon('username')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                <div className="flex items-center">
                  Email {renderSortIcon('email')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer">
                <div className="flex items-center">
                  Joined {renderSortIcon('createdAt')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('lastLogin')} className="cursor-pointer">
                <div className="flex items-center">
                  Last Login {renderSortIcon('lastLogin')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('activityCount')} className="cursor-pointer">
                <div className="flex items-center">
                  Activity {renderSortIcon('activityCount')}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                <div className="flex items-center">
                  Status {renderSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => {
              const activityInfo = getActivityLabel(user.activityCount || 0);
              
              return (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.username}</div>
                    {user.role === 'admin' && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            {user.lastLogin 
                              ? format(new Date(user.lastLogin), 'MMM d, yyyy') 
                              : format(new Date(user.createdAt), 'MMM d, yyyy')}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {user.lastLogin 
                              ? `${user.inactivityDays} days ago` 
                              : 'User has not logged in since account creation'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={activityInfo.color}>
                        {activityInfo.label}
                      </Badge>
                      <span className="text-xs text-gray-500">{user.activityCount || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className={user.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewUser(user._id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteUser(user._id, user.username)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {users.length} of {totalUsers} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {page}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page * pageSize >= totalUsers}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;