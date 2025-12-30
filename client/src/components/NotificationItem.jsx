import { memo, useCallback, useMemo } from "react";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import {
  NotificationCard,
  NotificationIcon,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
  NotificationActions,
} from "@/components/ui/notification-card";
import { CertificateDownloadButton } from "@/components/ui/certificate-download-button";
import { markAsRead } from "@/services/notificationService";
import {
  getNotificationIcon,
  getNotificationVariant,
  getNotificationIconBgClass,
} from "@/utils/notificationHelpers";

const NotificationItem = memo(({ notification, onRead }) => {
  const { _id, title, message, type, link, read, createdAt } = notification;

  // Memoize computed values
  const icon = useMemo(() => getNotificationIcon(type), [type]);
  const variant = useMemo(() => getNotificationVariant(type, read), [type, read]);
  const iconBgClass = useMemo(() => getNotificationIconBgClass(type), [type]);

  const formattedTime = useMemo(() => {
    try {
      const date = parseISO(createdAt);
      if (!isValid(date)) return "Recently";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting notification date:", error);
      return "Recently";
    }
  }, [createdAt]);

  const handleRead = useCallback(async () => {
    try {
      await markAsRead(_id);
      if (onRead) onRead();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, [_id, onRead]);

  const handleCertificateDownload = useCallback(async () => {
    if (link) {
      try {
        // Ensure we have the full URL
        const downloadUrl = link.startsWith('http') 
          ? link 
          : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${link}`;
        
        // Download the file directly 
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = link.split('/').pop(); 
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Mark as read after download
        handleRead();
      } catch (error) {
        console.error('Error downloading certificate:', error);
        // Fallback to opening in new tab if download fails
        const downloadUrl = link.startsWith('http') 
          ? link 
          : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${link}`;
        window.open(downloadUrl, '_blank');
      }
    }
  }, [link, handleRead]);

  return (
    <NotificationCard variant={variant} role="listitem">
      <NotificationIcon className={iconBgClass} aria-hidden="true">
        {icon}
      </NotificationIcon>

      <NotificationContent>
        <NotificationTitle>{title}</NotificationTitle>
        <NotificationDescription>{message}</NotificationDescription>
        <NotificationTime>
          <time dateTime={createdAt}>{formattedTime}</time>
        </NotificationTime>

        <NotificationActions>
          {type === "certificate" && link && (
            <CertificateDownloadButton
              variant="success"
              size="sm"
              onClick={handleCertificateDownload}
              aria-label="Download certificate"
            >
              Download Certificate
            </CertificateDownloadButton>
          )}

          {!read && (
            <button
              className="text-xs text-muted-foreground hover:underline"
              onClick={handleRead}
              aria-label="Mark notification as read"
            >
              Mark as read
            </button>
          )}
        </NotificationActions>
      </NotificationContent>
    </NotificationCard>
  );
});

export default NotificationItem;