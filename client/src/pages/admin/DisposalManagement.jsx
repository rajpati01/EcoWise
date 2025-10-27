import React, { useEffect, useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  MapPin,
  Loader2,
  Clipboard,
  User,
} from "lucide-react";
import { apiService as api } from "../../services/api";

const PAGE_SIZE = 10;

const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    case "completed":
      return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
    case "assigned":
      return <Badge className="bg-purple-100 text-purple-800">Assigned</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

export default function DisposalManagement() {
  const { toast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters & search
  const [statusFilter, setStatusFilter] = useState("all");
  const [centerFilter, setCenterFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // centers list (for filter dropdown)
  const [centers, setCenters] = useState([]);

  // selection & bulk actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState("");

  // delete confirm for single request
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // details modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRequest, setDetailsRequest] = useState(null);

  // status counts for visualization
  const [statusCounts, setStatusCounts] = useState({});

  // loading states for actions
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, centerFilter, searchTerm]);

  async function fetchCenters() {
    try {
      // try admin endpoint first then fallback
      const res = await api.get("/admin/disposal/centers?limit=200");
      const list =
        res && (res.centers || res.data || res)
          ? res.centers || res.data || res
          : [];
      setCenters(list);
    } catch (err) {
      console.warn("Failed to load centers for admin filter", err);
      // fallback to public endpoint
      try {
        const res2 = await api.get("/disposal/centers?limit=200");
        const list2 =
          res2 && (res2.centers || res2.data || res2)
            ? res2.centers || res2.data || res2
            : [];
        setCenters(list2);
      } catch (e) {
        setCenters([]);
      }
    }
  }

  async function fetchRequests() {
    setLoading(true);
    try {
      const statusParam =
        statusFilter && statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const centerParam = centerFilter
        ? `&center=${encodeURIComponent(centerFilter)}`
        : "";
      const searchParam = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const res = await api.get(
        `/admin/disposal/requests?page=${page}&limit=${PAGE_SIZE}${statusParam}${centerParam}${searchParam}`
      );

      // normalize response
      const data =
        res && (res.requests || res.data || res.items)
          ? res.requests || res.data || res.items
          : Array.isArray(res)
          ? res
          : [];
      const total =
        res && (res.total || res.count || res.totalItems)
          ? res.total || res.count || res.totalItems
          : data.length || 0;
      setRequests(data);
      setTotalItems(Number(total));
      setTotalPages(Math.max(1, Math.ceil(Number(total) / PAGE_SIZE)));

      // compute status counts if backend provides them or compute client-side
      if (res && res.counts) {
        setStatusCounts(res.counts);
      } else {
        // simple client-side counts
        const counts = {};
        (data || []).forEach((r) => {
          counts[r.status] = (counts[r.status] || 0) + 1;
        });
        setStatusCounts(counts);
      }

      // reset selection state
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error fetching admin disposal requests:", err);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Check server or auth.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map((r) => r._id || r.requestId));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const openDetails = (req) => {
    setDetailsRequest(req);
    setDetailsOpen(true);
  };

  const openDelete = (req) => {
    setRequestToDelete(req);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    setActionLoading(true);
    try {
      await api.delete(
        `/admin/disposal/requests/${
          requestToDelete._id || requestToDelete.requestId
        }`
      );
      toast({ title: "Deleted", description: "Request deleted." });
      fetchRequests();
    } catch (err) {
      console.error("Delete failed", err);
      toast({
        title: "Error",
        description: "Failed to delete request.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    }
  };

  const performAction = async (id, action) => {
    setActionLoading(true);
    try {
      // map action to endpoint
      if (action === "assign") {
        await api.put(`/admin/disposal/requests/${id}/status`, { status: "assigned" });
      } else if (action === "complete") {
       await api.put(`/admin/disposal/requests/${id}/status`, { status: "completed" });
      } else if (action === "reject") {
        await api.put(`/admin/disposal/requests/${id}/status`, { status: "rejected" });
      } else {
        throw new Error("Unknown action");
      }

      toast({ title: "Success", description: `Request ${action}ed` });
      fetchRequests();
    } catch (err) {
      console.error(`${action} failed for ${id}`, err);
      toast({
        title: "Error",
        description: `Failed to ${action} request.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openBulkDialog = (action) => {
    if (!selectedIds.length) {
      toast({
        title: "No selection",
        description: "Select at least one request",
        variant: "destructive",
      });
      return;
    }
    setBulkAction(action);
    setBulkDialogOpen(true);
  };

  const confirmBulk = async () => {
    setActionLoading(true);
    try {
      if (bulkAction === "complete") {
        await api.post("/admin/disposal/requests/bulk-complete", {
          requestIds: selectedIds,
        });
        toast({
          title: "Success",
          description: `${selectedIds.length} requests completed`,
        });
      } else if (bulkAction === "reject") {
        await api.post("/admin/disposal/requests/bulk-reject", {
          requestIds: selectedIds,
        });
        toast({
          title: "Success",
          description: `${selectedIds.length} requests rejected`,
        });
      } else if (bulkAction === "delete") {
        await api.post("/admin/disposal/requests/bulk-delete", {
          requestIds: selectedIds,
        });
        toast({
          title: "Success",
          description: `${selectedIds.length} requests deleted`,
        });
      }
      fetchRequests();
    } catch (err) {
      console.error("Bulk action failed", err);
      toast({
        title: "Error",
        description: "Bulk action failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setBulkDialogOpen(false);
      setBulkAction("");
    }
  };

  const formatDate = (d) =>
    d ? format(new Date(d), "MMM dd, yyyy h:mm a") : "—";

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Disposal Requests</h1>
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="outline"
            className="text-green-600"
            onClick={() => openBulkDialog("complete")}
            disabled={!selectedIds.length}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Selected
          </Button>
          <Button
            variant="outline"
            className="text-yellow-600"
            onClick={() => openBulkDialog("reject")}
            disabled={!selectedIds.length}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject Selected
          </Button>
          <Button
            variant="outline"
            className="text-red-600"
            onClick={() => openBulkDialog("delete")}
            disabled={!selectedIds.length}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-col mb-6 md:flex-row md:items-end md:space-x-4 gap-3 justify-between">
        <div className="flex-1 max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              fetchRequests();
            }}
            className="flex"
          >
            <Input
              placeholder="Search by request id or user email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={centerFilter}
            onChange={(e) => {
              setCenterFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded"
          >
            <option value="">All centers</option>
            {centers.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No requests found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="select all"
                  />
                </TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Waste</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => {
                const id = r._id || r.requestId;
                return (
                  <TableRow key={id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(id)}
                        onCheckedChange={() => handleSelect(id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono">
                      {r.requestId || r._id}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {r.user?.username  || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.user?.email || r.userEmail || ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {r.wasteType || r.category || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.quantity ? `${r.quantity} ${r.unit || "kg"}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />{" "}
                        {r.centerName ||
                          (r.centerId && typeof r.centerId === "object"
                            ? r.centerId.name
                            : r.centerId) ||
                          "—"}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(r.scheduledAt || r.createdAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell className="text-right">
                      {r.pointsAwarded ?? r.pointsEarned ?? "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetails(r)}>
                            <Eye className="mr-2 h-4 w-4" /> View details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => performAction(id, "assign")}
                          >
                            <Clipboard className="mr-2 h-4 w-4" /> Assign
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => performAction(id, "complete")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" /> Complete
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => performAction(id, "reject")}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => openDelete(r)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium">
            {requests.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(
              page * PAGE_SIZE,
              (page - 1) * PAGE_SIZE + requests.length
            )}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> requests
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk action confirm dialog */}
      <AlertDialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "complete"
                ? "Complete selected requests"
                : bulkAction === "reject"
                ? "Reject selected requests"
                : "Delete selected requests"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction} {selectedIds.length}{" "}
              selected requests? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                bulkAction === "delete"
                  ? "bg-red-600"
                  : bulkAction === "complete"
                  ? "bg-green-600"
                  : "bg-yellow-600"
              }
              onClick={confirmBulk}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Single delete confirm dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete request "
              {requestToDelete?.requestId || requestToDelete?._id}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={confirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details dialog (read-only) */}
      <AlertDialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request details</AlertDialogTitle>
            <AlertDialogDescription>
              Detailed information for request{" "}
              {detailsRequest?.requestId || detailsRequest?._id}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-4 space-y-3">
            {detailsRequest ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Request ID</div>
                    <div className="font-mono">
                      {detailsRequest.requestId || detailsRequest._id}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div>{getStatusBadge(detailsRequest.status)}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">User</div>
                    <div className="text-sm">
                      <User className="inline-block mr-2" />{" "}
                      {detailsRequest.user?.name ||
                        detailsRequest.userName ||
                        detailsRequest.userEmail}
                      <div className="text-xs text-gray-500">
                        {detailsRequest.user?.email || detailsRequest.userEmail}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Center</div>
                    <div>
                      {detailsRequest.centerName ||
                        (detailsRequest.centerId &&
                        typeof detailsRequest.centerId === "object"
                          ? detailsRequest.centerId.name
                          : detailsRequest.centerId) ||
                        "No preference"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Waste</div>
                    <div className="text-sm">
                      {detailsRequest.wasteType ||
                        detailsRequest.category ||
                        "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {detailsRequest.quantity
                        ? `${detailsRequest.quantity} ${
                            detailsRequest.unit || "kg"
                          }`
                        : ""}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Scheduled</div>
                    <div>
                      {formatDate(
                        detailsRequest.scheduledAt || detailsRequest.createdAt
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Notes</div>
                  <div className="text-sm">
                    {detailsRequest.notes || "No notes"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Classification</div>
                  {detailsRequest.classificationId ? (
                    <a
                      className="text-primary underline"
                      href={`/classification/${detailsRequest.classificationId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View classification
                    </a>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No classification linked
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">No details</div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (detailsRequest)
                  performAction(
                    detailsRequest._id || detailsRequest.requestId,
                    "complete"
                  );
              }}
            >
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
