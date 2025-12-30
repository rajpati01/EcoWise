import React, { useState, useEffect } from "react";
import { useToast } from "../../components/ui/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
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
  Filter,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { apiService as api } from "../../services/api";

const BlogManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState("");

  const blogsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, status, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const statusParam = status !== "all" ? `&status=${status}` : "";
      const searchParam = searchTerm ? `&search=${searchTerm}` : "";

      const response = await api.get(
        `/admin/blogs?page=${currentPage}&limit=${blogsPerPage}${statusParam}${searchParam}`
      );

      // Check if the response structure matches the expected format
      if (response.blogs) {
        // If blogs is directly in the response
        setBlogs(response.blogs);
        setTotalPages(Math.ceil(response.total / blogsPerPage));
      } else if (response.data && response.data.blogs) {
        // If blogs is nested in response.data
        setBlogs(response.data.blogs);
        setTotalPages(Math.ceil(response.data.total / blogsPerPage));
      } else {
        // Fallback if structure is different
        console.error("Unexpected response structure:", response);
        setBlogs([]);
        setTotalPages(1);
      }
      setLoading(false);
      setSelectedBlogs([]);
      setIsAllSelected(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs. Please try again.",
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
    // The fetchBlogs will be triggered by the useEffect
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map((blog) => blog._id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSelectBlog = (blogId) => {
    if (selectedBlogs.includes(blogId)) {
      setSelectedBlogs(selectedBlogs.filter((id) => id !== blogId));
    } else {
      setSelectedBlogs([...selectedBlogs, blogId]);
    }
  };

  const openDeleteDialog = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      await api.delete(`/admin/blogs/${blogToDelete._id}`);

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });

      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setBlogToDelete(null);
    }
  };

  const openBulkActionDialog = (action) => {
    if (selectedBlogs.length === 0) {
      toast({
        title: "No Blogs Selected",
        description: "Please select at least one blog to perform this action.",
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
        await api.post(`/admin/blogs/bulk-${bulkAction}`, {
          blogIds: selectedBlogs,
        });

        toast({
          title: "Success",
          description: `${selectedBlogs.length} blogs ${
            bulkAction === "approve" ? "approved" : "rejected"
          } successfully`,
        });
      } else if (bulkAction === "delete") {
        await api.post(`/admin/blogs/bulk-delete`, {
          blogIds: selectedBlogs,
        });

        toast({
          title: "Success",
          description: `${selectedBlogs.length} blogs deleted successfully`,
        });
      }

      fetchBlogs();
    } catch (error) {
      console.error(`Error performing bulk ${bulkAction}:`, error);
      toast({
        title: "Error",
        description: `Failed to ${bulkAction} blogs. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setShowBulkActionDialog(false);
      setBulkAction("");
    }
  };

  const handleBlogAction = async (blogId, action) => {
    try {
      await api.put(`/admin/blogs/${blogId}/${action}`);

      toast({
        title: "Success",
        description: `Blog ${
          action === "approve" ? "approved" : "rejected"
        } successfully`,
      });

      fetchBlogs();
    } catch (error) {
      console.error(`Error ${action}ing blog:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} blog. Please try again.`,
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
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            onClick={() => openBulkActionDialog("approve")}
            disabled={selectedBlogs.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Selected
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => openBulkActionDialog("reject")}
            disabled={selectedBlogs.length === 0}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject Selected
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => openBulkActionDialog("delete")}
            disabled={selectedBlogs.length === 0}
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
                  placeholder="Search blogs by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              onValueChange={handleStatusChange}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
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
          ) : blogs.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No blogs found. Try changing your filters or search term.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all blogs"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBlogs.includes(blog._id)}
                        onCheckedChange={() => handleSelectBlog(blog._id)}
                        aria-label={`Select blog ${blog.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {blog.title}
                    </TableCell>
                    <TableCell>
                      {blog.authorName || "Unknown"}
                      <p className="text-xs text-gray-500">{blog.authorId?.email}</p>
                    </TableCell>
                    <TableCell>{formatDate(blog.createdAt)}</TableCell>
                    <TableCell>{renderStatusBadge(blog.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${blog._id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>

                          {blog.status !== "approved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleBlogAction(blog._id, "approve")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}

                          {blog.status !== "rejected" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleBlogAction(blog._id, "reject")
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(blog)}
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
              {blogs.length === 0 ? 0 : (currentPage - 1) * blogsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                currentPage * blogsPerPage,
                (currentPage - 1) * blogsPerPage + blogs.length
              )}
            </span>{" "}
            of <span className="font-medium">{totalPages * blogsPerPage}</span>{" "}
            blogs
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

      {/* Delete Blog Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the blog "{blogToDelete?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Dialog */}
      <AlertDialog
        open={showBulkActionDialog}
        onOpenChange={setShowBulkActionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "approve"
                ? "Approve Selected Blogs"
                : bulkAction === "reject"
                ? "Reject Selected Blogs"
                : "Delete Selected Blogs"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === "delete"
                ? `Are you sure you want to delete ${selectedBlogs.length} selected blogs? This action cannot be undone.`
                : `Are you sure you want to ${bulkAction} ${selectedBlogs.length} selected blogs?`}
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

export default BlogManagement;
