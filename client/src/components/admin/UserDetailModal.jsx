import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Mail,
  User as UserIcon,
  Activity,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  Recycle,
  GitPullRequestArrow
} from "lucide-react";

const UserDetailModal = ({ user, isOpen, isLoading, onClose, onDelete }) => {
  // Loading state check
  if (isLoading || !user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Extract the actual user data accounting for all possible structures
  const userData = user.success ? user.data : user;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP");
  };

  const getActivityLevel = (count = 0) => {
    if (count >= 20) return { label: "High Activity", color: "text-green-600" };
    if (count >= 5)
      return { label: "Medium Activity", color: "text-yellow-600" };
    return { label: "Low Activity", color: "text-red-600" };
  };

  // Calculate total activity correctly by summing the individual counts
  const totalActivity =
    (userData.blogsCount || 0) +
    (userData.commentsCount || 0) +
    (userData.classificationsCount || 0) +
    (userData.campaignsCount || 0) +
    (userData.requestsCount || 0);

  const activityInfo = getActivityLevel(totalActivity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {isLoading || !user ? (
          // Loading state
          <>
            <DialogHeader>
              <DialogTitle>Loading User Details...</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                User Profile: {userData.username}
                {userData.role === "admin" && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    Admin
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Info Card */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Username
                    </div>
                    <div className="font-medium">{userData.username}</div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                    <div className="font-medium">{userData.email}</div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      Registered
                    </div>
                    <div className="font-medium">
                      {formatDate(userData.createdAt)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      Last Login
                    </div>
                    <div className="font-medium">
                      {userData.lastLogin
                        ? formatDate(userData.lastLogin)
                        : "Never logged in"}
                      {userData.inactivityDays > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({userData.inactivityDays} days ago)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Activity className="mr-2 h-4 w-4" />
                      Activity Level
                    </div>
                    <div className={`font-medium ${activityInfo.color}`}>
                      {activityInfo.label} ({totalActivity} actions)
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      Status
                    </div>
                    <Badge
                      variant={
                        userData.status === "active" ? "default" : "destructive"
                      }
                      className={
                        userData.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {userData.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      Total Logins
                    </div>
                    <div className="font-medium">
                      {userData.totalLogins || 1}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Card */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="text-xs text-blue-700 mb-1 flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Blogs
                      </div>
                      <div className="text-2xl font-bold">
                        {userData.blogsCount || 0}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-600 mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Campaigns
                      </div>
                      <div className="text-2xl font-bold">
                        {userData.campaignsCount || 0}
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600 mb-1 flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Comments
                      </div>
                      <div className="text-2xl font-bold">
                        {userData.commentsCount || 0}
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600 mb-1 flex items-center">
                        <GitPullRequestArrow  className="h-3 w-3 mr-1" />D Requests
                      </div>
                      <div className="text-2xl font-bold">
                        {userData.requestsCount || 0}
                      </div>
                    </div>

                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="text-xs text-teal-600 mb-1 flex items-center">
                        <Recycle className="h-3 w-3 mr-1" />
                        Classify
                      </div>
                      <div className="text-2xl font-bold">
                        {userData.classificationsCount !== undefined
                          ? userData.classificationsCount
                          : 0}
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-xs text-yellow-600 mb-1 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        Total Activity
                      </div>
                      <div className="text-2xl font-bold">{totalActivity}</div>
                    </div>
                  </div>

                  <Tabs defaultValue="blogs">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="blogs">Recent Blogs</TabsTrigger>
                      <TabsTrigger value="comments">
                        Recent Comments
                      </TabsTrigger>
                      <TabsTrigger value="campaigns">
                        Recent Campaigns
                      </TabsTrigger>
                      <TabsTrigger value="disposal">
                        Disposal Requests
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="blogs"
                      className="max-h-60 overflow-y-auto"
                    >
                      {userData.recentBlogs &&
                      userData.recentBlogs.length > 0 ? (
                        <ul className="divide-y">
                          {userData.recentBlogs.map((blog) => (
                            <li key={blog._id} className="py-3">
                              <div className="font-medium text-base">
                                {blog.title}
                              </div>
                              <div className="text-sm text-gray-700 my-1 line-clamp-2">
                                {blog.excerpt || blog.content}
                              </div>
                              <div className="text-xs text-gray-500">
                                Published: {formatDate(blog.createdAt)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No blogs found
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="comments"
                      className="max-h-60 overflow-y-auto"
                    >
                      {userData.recentComments &&
                      userData.recentComments.length > 0 ? (
                        <ul className="divide-y">
                          {userData.recentComments.map((comment) => (
                            <li key={comment._id} className="py-3">
                              <div className="font-medium text-base">
                                {comment.content}
                              </div>
                              <div className="text-xs text-gray-500">
                                Posted: {formatDate(comment.createdAt)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No comments found
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="campaigns"
                      className="max-h-60 overflow-y-auto"
                    >
                      {userData.recentCampaigns &&
                      userData.recentCampaigns.length > 0 ? (
                        <ul className="divide-y">
                          {userData.recentCampaigns.map((campaign) => (
                            <li key={campaign._id} className="py-3">
                              <div className="font-medium text-base">
                                {campaign.title || "Untitled Campaign"}
                              </div>
                              <div className="text-sm text-gray-700 my-1 line-clamp-2">
                                {campaign.description ||
                                  "No description available"}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                <span>
                                  Created: {formatDate(campaign.createdAt)}
                                </span>
                                {campaign.status && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      campaign.status === "active"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : campaign.status === "completed"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                    }
                                  >
                                    {campaign.status.charAt(0).toUpperCase() +
                                      campaign.status.slice(1)}
                                  </Badge>
                                )}
                                {campaign.participants && (
                                  <span className="flex items-center">
                                    <UserIcon className="h-3 w-3 mr-1" />
                                    {campaign.participants.length} participants
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No campaigns found
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="disposal"
                      className="max-h-60 overflow-y-auto"
                    >
                      {userData.recentDisposalRequests &&
                      userData.recentDisposalRequests.length > 0 ? (
                        <ul className="divide-y">
                          {userData.recentDisposalRequests.map((request) => (
                            <li key={request._id} className="py-3">
                              <div className="font-medium text-base">
                                {request.wasteType || "Waste Disposal Request"}
                              </div>
                              <div className="text-sm text-gray-700 my-1">
                                Category: {request.category || "N/A"}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                <span>
                                  Requested: {formatDate(request.createdAt)}
                                </span>
                                {request.status && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      request.status === "pending"
                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        : request.status === "approved"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : request.status === "completed"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : request.status === "rejected"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                    }
                                  >
                                    {request.status.charAt(0).toUpperCase() +
                                      request.status.slice(1)}
                                  </Badge>
                                )}
                                {request.quantity && (
                                  <span>
                                    Qty: {request.quantity}{" "}
                                    {request.unit || "kg"}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No disposal requests found
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {userData.status === "inactive" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-700">
                    Inactive Account Warning
                  </div>
                  <div className="text-sm text-red-600">
                    This user has been inactive for {userData.inactivityDays}{" "}
                    days. Consider sending a reminder or deleting the account.
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between mt-6">
              <Button
                variant="destructive"
                onClick={() => onDelete(userData._id, userData.username)}
                className="flex items-center"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete User
              </Button>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;