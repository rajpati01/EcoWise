import React, { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, AlertTriangle, UserCheck, UserX } from "lucide-react";

import UserTable from "../../components/admin/UserTable";
import UserFilters from "../../components/admin/UserFilters";
import UserDetailModal from "../../components/admin/UserDetailModal";
import DeleteUserModal from "../../components/admin/DeleteUserModel";
import DashboardCard from "../../components/admin/DashboardCard";
import { set } from "date-fns";

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ status: "all" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ field: "lastLogin", order: "desc" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState({ id: null, username: "" });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const limit = 10;

  // Fetch users
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "admin-users",
      page,
      limit,
      filters.status,
      search,
      sort.field,
      sort.order,
    ],
    queryFn: () =>
      userService.getAdminUsers({
        page,
        limit,
        sort: sort.field,
        order: sort.order,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(search && { search }),
      }),
  });

  // Extract users and pagination data
  const users = usersResponse?.data || [];
  const pagination = usersResponse?.pagination || { total: 0 };

  // Fetch user details
  const { data: userDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["admin-user-details", selectedUser],
    queryFn: async () => {
      if (!selectedUser) return null;
      const response = await userService.getAdminUserDetails(selectedUser);
      return response;
    },
    enabled: !!selectedUser,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (userId) => userService.deleteAdminUser(userId),
    onSuccess: () => {
      toast.success(`User ${deleteUser.username} has been deleted`);
      setDeleteModalOpen(false);
      setDeleteUser({ id: null, username: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (detailModalOpen) {
        setDetailModalOpen(false);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete user");
    },
  });

  // Handle view user
  const handleViewUser = (userId) => {
    setDetailModalOpen(true);
    setSelectedUser(userId);
    // Note: We don't need to manually open the modal here as it's handled in the query's onSuccess
  };

  // Handle delete user
  const handleDeleteUser = (userId, username) => {
    setDeleteUser({ id: userId, username });
    setDeleteModalOpen(true);
  };

  // Handle sort
  const handleSort = (field, order) => {
    setSort({ field, order });
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (query) => {
    setSearch(query);
    setPage(1); // Reset to first page when search changes
  };

  // Error handling
  useEffect(() => {
    if (isError) {
      toast.error(error.message || "Error loading users");
    }
  }, [isError, error]);

  // Calculate stats from the user data
  const stats = {
    total: pagination.total || 0, // Use the TOTAL from pagination
    active: Array.isArray(users)
      ? users.filter((user) => user.status === "active").length
      : 0,
    inactive: Array.isArray(users)
      ? users.filter((user) => user.status === "inactive").length
      : 0,
  };

  // Calculate percentage for active users
  const activePercentage =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <DashboardCard
            title="Total Users"
            value={stats.total}
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <DashboardCard
            title="Active Users"
            value={stats.active}
            percentage={activePercentage}
            icon={<UserCheck className="h-6 w-6" />}
            color="green"
          />
          <DashboardCard
            title="Inactive Users"
            value={stats.inactive}
            percentage={100 - activePercentage}
            icon={<UserX className="h-6 w-6" />}
            color="red"
          />
        </div>

        {/* Filters */}
        <UserFilters
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          loading={isLoading}
        />

        {/* Users Table */}
        <UserTable
          users={users}
          loading={isLoading}
          onSort={handleSort}
          sortField={sort.field}
          sortOrder={sort.order}
          onViewUser={handleViewUser}
          onDeleteUser={handleDeleteUser}
          page={page}
          pageSize={limit}
          totalUsers={pagination.total}
          onPageChange={setPage}
        />

        {/* User Detail Modal */}
        <UserDetailModal
          user={userDetails}
          isOpen={detailModalOpen}
          isLoading={isLoadingDetails || !userDetails}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedUser(null);
          }}
          onDelete={handleDeleteUser}
        />

        {/* Delete User Modal */}
        <DeleteUserModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => deleteMutation.mutate(deleteUser.id)}
          username={deleteUser.username}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default UsersPage;
