import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Edit, Save, X, Loader2, Lock } from "lucide-react";
import { format } from "date-fns";
import { getUserInitial } from "@/utils/userHelpers";

function ProfileInfoCard({
  user,
  userName,
  userLevel,
  isEditing,
  editData,
  isUpdating,
  onEdit,
  onCancel,
  onSave,
  onChange,
}) {
  const initial = getUserInitial(userName);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={onSave} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={user?.profileImage} alt={`${userName} avatar`} loading="lazy" />
            <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
          </Avatar>
          <Badge className="text-sm">{userLevel}</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            {isEditing ? (
              <Input 
                id="username" 
                name="username" 
                value={editData.username} 
                onChange={onChange} 
                className="mt-1"
                placeholder="Enter your username"
                minLength={3}
                maxLength={30}
              />
            ) : (
              <div className="flex items-center space-x-2 mt-1">
                <User className="h-4 w-4 text-gray-400" />
                <span>{userName}</span>
              </div>
            )}
            {isEditing && (
              <p className="text-xs text-muted-foreground mt-1">
                3-15 characters, letters, numbers, underscore, and hyphen only
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              Email
              <Lock className="h-3 w-3 text-muted-foreground" />
            </Label>
            <div className="flex items-center space-x-2 mt-1 p-2 bg-muted/50 rounded-md">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            {isEditing && (
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed for security reasons
              </p>
            )}
          </div>

          <div>
            <Label>Member Since</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{format(new Date(user?.createdAt || Date.now()), "MMMM yyyy")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ProfileInfoCard);