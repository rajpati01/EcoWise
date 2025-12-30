import { useEffect, useState, useCallback, memo } from "react";
import { NotificationBell as NotificationBellIcon } from "@/components/ui/notification-bell";
import {
  NotificationDropdown,
  NotificationDropdownTrigger,
  NotificationDropdownContent,
} from "@/components/ui/notification-dropdown";
import {
  NotificationList,
  NotificationListHeader,
  NotificationListTitle,
  NotificationListContent,
  NotificationListFooter,
} from "@/components/ui/notification-list";
import NotificationItem from "@/components/NotificationItem";
import {
  getNotifications,
  markAllAsRead,
} from "@/services/notificationService";

// Constants
const POLL_INTERVAL_MS = 60000; // 1 minute
const MAX_DISPLAYED_NOTIFICATIONS = 10;

const NotificationBellComponent = memo(({ onViewAll }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    try {
      setError(null);
      const response = await getNotifications();

      // Normalize to array
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setNotifications(data.slice(0, MAX_DISPLAYED_NOTIFICATIONS));
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setError("Failed to mark notifications as read");
    }
  }, [loadNotifications]);

  const handleViewAll = useCallback(() => {
    setIsOpen(false);
    if (onViewAll) {
      onViewAll();
    } else {
      // Fallback: navigate to notifications page
      window.location.href = "/notifications";
    }
  }, [onViewAll]);

  useEffect(() => {
    loadNotifications();

    // Poll for new notifications
    const interval = setInterval(loadNotifications, POLL_INTERVAL_MS);

    // Listen for custom reload event
    const handleReloadNotifications = () => {
      loadNotifications();
    };
    window.addEventListener('reloadNotifications', handleReloadNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener('reloadNotifications', handleReloadNotifications);
    };
  }, [loadNotifications]);

  return (
    <NotificationDropdown open={isOpen} onOpenChange={setIsOpen}>
      <NotificationDropdownTrigger asChild>
        <NotificationBellIcon
          badgeContent={unreadCount}
          aria-label={`Notifications: ${unreadCount} unread`}
        />
      </NotificationDropdownTrigger>
      <NotificationDropdownContent
        size="md"
        aria-label="Notifications dropdown"
      >
        <NotificationList>
          <NotificationListHeader>
            <NotificationListTitle>Notifications</NotificationListTitle>
            {unreadCount > 0 && (
              <button
                className="text-xs text-primary hover:underline"
                onClick={handleMarkAllRead}
                aria-label="Mark all notifications as read"
              >
                Mark all as read
              </button>
            )}
          </NotificationListHeader>

          <NotificationListContent>
            {isLoading ? (
              <div
                className="py-6 text-center text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Loading notifications...
              </div>
            ) : error ? (
              <div
                className="py-6 text-center text-sm text-red-500"
                role="alert"
              >
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div
                className="py-6 text-center text-sm text-muted-foreground"
                role="status"
              >
                No notifications
              </div>
            ) : (
              <div role="list" aria-label="Notification list">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onRead={loadNotifications}
                  />
                ))}
              </div>
            )}
          </NotificationListContent>

          {notifications.length > 0 && (
            <NotificationListFooter>
              <button
                className="text-xs text-muted-foreground hover:underline"
                onClick={handleViewAll}
                aria-label="View all notifications"
              >
                View all notifications
              </button>
            </NotificationListFooter>
          )}
        </NotificationList>
      </NotificationDropdownContent>
    </NotificationDropdown>
  );
});

export default NotificationBellComponent;