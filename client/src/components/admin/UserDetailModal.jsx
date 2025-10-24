import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
  Award,
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
  const totalActivity = (
    (userData.blogsCount || 0) +
    (userData.commentsCount || 0) +
    (userData.classificationsCount || 0) +
    (userData.campaignsJoined || 0)
  );
  
  const activityInfo = getActivityLevel(totalActivity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 mb-1 flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Blogs
                  </div>
                  <div className="text-2xl font-bold">
                    {userData.blogsCount || 0}
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
                
                <div className="bg-teal-50 p-3 rounded-lg">
                  <div className="text-xs text-teal-600 mb-1 flex items-center">
                    <Recycle className="h-3 w-3 mr-1" />
                    Classifications
                  </div>
                  <div className="text-2xl font-bold">
                     {userData.classificationsCount !== undefined ? userData.classificationsCount : 0}
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-xs text-yellow-600 mb-1 flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    Total Activity
                  </div>
                  <div className="text-2xl font-bold">
                    {totalActivity}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="blogs">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="blogs">Recent Blogs</TabsTrigger>
                  <TabsTrigger value="comments">Recent Comments</TabsTrigger>
                  <TabsTrigger value="classifications">Recent Classifications</TabsTrigger>
                </TabsList>

                <TabsContent value="blogs" className="max-h-60 overflow-y-auto">
                  {userData.recentBlogs && userData.recentBlogs.length > 0 ? (
                    <ul className="divide-y">
                      {userData.recentBlogs.map((blog) => (
                        <li key={blog._id} className="py-3">
                          <div className="font-medium text-base">{blog.title}</div>
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
                          <div className="font-medium text-base">{comment.content}</div>
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
                  value="classifications"
                  className="max-h-60 overflow-y-auto"
                >
                  {userData.recentClassifications &&
                  userData.recentClassifications?.length > 0 ? (
                    <ul className="divide-y">
                      {userData.recentClassifications.map((classification) => (
                        <li key={classification._id} className="py-3">
                          <div className="font-medium text-base">
                            {classification.wasteType || classification.type || "Waste Classification"}
                          </div>
                          <div className="text-sm text-gray-700 my-1">
                            {classification.category && (
                              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                                {classification.category}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Classified: {formatDate(classification.createdAt)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No classifications found
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
                This user has been inactive for {userData.inactivityDays} days.
                Consider sending a reminder or deleting the account.
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