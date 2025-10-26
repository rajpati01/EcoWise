import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  NotificationCard,
  NotificationIcon,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
  NotificationActions
} from './ui/notification-card';
import { CertificateDownloadButton } from './ui/certificate-download-button';
import { markAsRead } from '../services/notificationService';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Bell 
} from 'lucide-react'; 

const NotificationItem = ({ notification, onRead }) => {
  const { _id, title, message, type, link, read, createdAt } = notification;
  
  const handleRead = async () => {
    try {
      await markAsRead(_id);
      if (onRead) onRead();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'certificate':
        return <Award className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Map notification type to variant for styling
  const getVariant = () => {
    if (!read) return 'unread';
    
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'alert': return 'destructive';
      case 'certificate': return 'certificate';
      default: return 'default';
    }
  };
  
  return (
    <NotificationCard variant={getVariant()}>
      <NotificationIcon className={
        type === 'success' ? 'bg-green-100' :
        type === 'warning' ? 'bg-yellow-100' :
        type === 'alert' ? 'bg-red-100' :
        type === 'certificate' ? 'bg-blue-100' :
        'bg-blue-50'
      }>
        {getIcon()}
      </NotificationIcon>
      
      <NotificationContent>
        <NotificationTitle>{title}</NotificationTitle>
        <NotificationDescription>{message}</NotificationDescription>
        <NotificationTime>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </NotificationTime>
        
        <NotificationActions>
          {type === 'certificate' && link && (
            <CertificateDownloadButton 
              variant="success" 
              size="sm" 
              onClick={() => {
                window.location.href = link;
                handleRead();
              }}
            >
              Download Certificate
            </CertificateDownloadButton>
          )}
          
          {!read && (
            <button 
              className="text-xs text-muted-foreground hover:underline"
              onClick={handleRead}
            >
              Mark as read
            </button>
          )}
        </NotificationActions>
      </NotificationContent>
    </NotificationCard>
  );
};

export default NotificationItem;