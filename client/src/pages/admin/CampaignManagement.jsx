import React, { useState, useEffect } from "react";
import { useToast } from "../../components/ui/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
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
  Calendar,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { apiService as api } from "../../services/api";

const CampaignManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  
  const campaignsPerPage = 10;

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, status, searchTerm]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const statusParam = status !== "all" ? `&status=${status}` : "";
      const searchParam = searchTerm ? `&search=${searchTerm}` : "";

      const response = await api.get(
        `/admin/campaigns?page=${currentPage}&limit=${campaignsPerPage}${statusParam}${searchParam}`
      );
      
      // Handle different response structures
      if (response.campaigns) {
        setCampaigns(response.campaigns);
        setTotalPages(Math.ceil(response.total / campaignsPerPage));
      } else if (response.data && response.data.campaigns) {
        setCampaigns(response.data.campaigns);
        setTotalPages(Math.ceil(response.data.total / campaignsPerPage));
      } else {
        // Fallback if structure is different
        console.error("Unexpected response structure:", response);
        setCampaigns([]);
        setTotalPages(1);
      }
      
      setLoading(false);
      setSelectedCampaigns([]);
      setIsAllSelected(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // The fetchCampaigns will be triggered by the useEffect
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map((campaign) => campaign._id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSelectCampaign = (campaignId) => {
    if (selectedCampaigns.includes(campaignId)) {
      setSelectedCampaigns(selectedCampaigns.filter((id) => id !== campaignId));
    } else {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    }
  };

  const openDeleteDialog = (campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    
    try {
      await api.delete(`/admin/campaigns/${campaignToDelete._id}`);
      
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      
      fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    }
  };

  const openBulkActionDialog = (action) => {
    if (selectedCampaigns.length === 0) {
      toast({
        title: "No Campaigns Selected",
        description: "Please select at least one campaign to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    setBulkAction(action);
    setShowBulkActionDialog(true);
  };

  const confirmBulkAction = async () => {
    try {
      if (bulkAction === "approve" || bulkAction === "reject") {
        await api.post(`/admin/campaigns/bulk-${bulkAction}`, {
          campaignIds: selectedCampaigns,
        });
        
        toast({
          title: "Success",
          description: `${selectedCampaigns.length} campaigns ${bulkAction === "approve" ? "approved" : "rejected"} successfully`,
        });
      } else if (bulkAction === "delete") {
        await api.post(`/admin/campaigns/bulk-delete`, {
          campaignIds: selectedCampaigns,
        });
        
        toast({
          title: "Success",
          description: `${selectedCampaigns.length} campaigns deleted successfully`,
        });
      }
      
      fetchCampaigns();
    } catch (error) {
      console.error(`Error performing bulk ${bulkAction}:`, error);
      toast({
        title: "Error",
        description: `Failed to ${bulkAction} campaigns. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setShowBulkActionDialog(false);
      setBulkAction("");
    }
  };

  const handleCampaignAction = async (campaignId, action) => {
    try {
      await api.put(`/admin/campaigns/${campaignId}/${action}`);
      
      toast({
        title: "Success",
        description: `Campaign ${action === "approve" ? "approved" : "rejected"} successfully`,
      });
      
      fetchCampaigns();
    } catch (error) {
      console.error(`Error ${action}ing campaign:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} campaign. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case "active":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Active</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            onClick={() => openBulkActionDialog("approve")}
            disabled={selectedCampaigns.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Selected
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => openBulkActionDialog("reject")}
            disabled={selectedCampaigns.length === 0}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject Selected
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => openBulkActionDialog("delete")}
            disabled={selectedCampaigns.length === 0}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-1 max-w-md">
              <form onSubmit={handleSearch} className="flex w-full">
                <Input
                  placeholder="Search campaigns by title, location or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={handleStatusChange}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No campaigns found. Try changing your filters or search term.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all campaigns"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedCampaigns.includes(campaign._id)}
                        onCheckedChange={() => handleSelectCampaign(campaign._id)}
                        aria-label={`Select campaign ${campaign.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {campaign.title}
                    </TableCell>
                    <TableCell>{campaign.createdBy?.username || "Unknown"}
                      <p className="text-xs text-gray-500">{campaign.createdBy?.email}</p>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                      {campaign.location}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        {formatDate(campaign.startDate || campaign.date)}
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/campaigns/${campaign._id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          
                          {campaign.status !== "approved" && campaign.status !== "active" && (
                            <DropdownMenuItem 
                              onClick={() => handleCampaignAction(campaign._id, "approve")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          
                          {campaign.status !== "rejected" && (
                            <DropdownMenuItem 
                              onClick={() => handleCampaignAction(campaign._id, "reject")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(campaign)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {campaigns.length === 0 ? 0 : (currentPage - 1) * campaignsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * campaignsPerPage, (currentPage - 1) * campaignsPerPage + campaigns.length)}
            </span>{" "}
            of <span className="font-medium">{totalPages * campaignsPerPage}</span> campaigns
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Campaign Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the campaign "{campaignToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Dialog */}
      <AlertDialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "approve"
                ? "Approve Selected Campaigns"
                : bulkAction === "reject"
                ? "Reject Selected Campaigns"
                : "Delete Selected Campaigns"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === "delete"
                ? `Are you sure you want to delete ${selectedCampaigns.length} selected campaigns? This action cannot be undone.`
                : `Are you sure you want to ${bulkAction} ${selectedCampaigns.length} selected campaigns?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkAction} 
              className={
                bulkAction === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : bulkAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }
            >
              {bulkAction === "approve"
                ? "Approve"
                : bulkAction === "reject"
                ? "Reject"
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignManagement;