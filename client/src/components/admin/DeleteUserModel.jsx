import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const DeleteUserModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  username, 
  isDeleting 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete User Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">
              Are you sure you want to delete <span className="font-bold">{username}</span>'s account? 
              This action cannot be undone.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-700">
              <p className="font-semibold mb-1">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The user account and profile</li>
                <li>All blogs created by this user</li>
                <li>All comments posted by this user</li>
                <li>Any likes or other activity by this user</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserModal;