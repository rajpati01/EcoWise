import React, { useEffect, useState } from "react";
import { NotificationBell } from "./ui/notification-bell";
import {
  NotificationDropdown,
  NotificationDropdownTrigger,
  NotificationDropdownContent,
} from "./ui/notification-dropdown";
import {
  NotificationList,
  NotificationListHeader,
  NotificationListTitle,
  NotificationListContent,
  NotificationListFooter,
} from "./ui/notification-list";
import NotificationItem from "./NotificationItem";
import {
  getNotifications,
  markAllAsRead,
} from "../services/notificationService";

const NotificationBellComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();

      // Normalize to array and set state
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Poll for new notifications every minute
    const interval = setInterval(loadNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationDropdown open={isOpen} onOpenChange={setIsOpen}>
      <NotificationDropdownTrigger asChild>
        <NotificationBell badgeContent={unreadCount} />
      </NotificationDropdownTrigger>
      <NotificationDropdownContent size="md">
        <NotificationList>
          <NotificationListHeader>
            <NotificationListTitle>Notifications</NotificationListTitle>
            {unreadCount > 0 && (
              <button
                className="text-xs text-primary hover:underline"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            )}
          </NotificationListHeader>
          <NotificationListContent>
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onRead={loadNotifications}
                />
              ))
            )}
          </NotificationListContent>
          {notifications.length > 0 && (
            <NotificationListFooter>
              <button className="text-xs text-muted-foreground hover:underline">
                View all
              </button>
            </NotificationListFooter>
          )}
        </NotificationList>
      </NotificationDropdownContent>
    </NotificationDropdown>
  );
};

export default NotificationBellComponent;
