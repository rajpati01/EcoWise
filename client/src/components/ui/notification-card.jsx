import { forwardRef } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const notificationCardVariants = cva(
  "relative flex w-full items-start gap-4 rounded-lg border p-4 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background",
        unread: "bg-muted/50 border-l-4 border-l-primary",
        success: "bg-muted/50 border-l-4 border-l-green-500",
        warning: "bg-muted/50 border-l-4 border-l-yellow-500",
        destructive: "bg-muted/50 border-l-4 border-l-destructive",
        certificate: "bg-muted/50 border-l-4 border-l-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const NotificationCard = forwardRef(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(notificationCardVariants({ variant }), className)}
      {...props}
    />
  )
)
NotificationCard.displayName = "NotificationCard"

const NotificationIcon = forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", className)}
      {...props}
    />
  )
)
NotificationIcon.displayName = "NotificationIcon"

const NotificationContent = forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  )
)
NotificationContent.displayName = "NotificationContent"

const NotificationTitle = forwardRef(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
NotificationTitle.displayName = "NotificationTitle"

const NotificationDescription = forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
NotificationDescription.displayName = "NotificationDescription"

const NotificationTime = forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
)
NotificationTime.displayName = "NotificationTime"

const NotificationActions = forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 pt-2", className)}
      {...props}
    />
  )
)
NotificationActions.displayName = "NotificationActions"

export {
  NotificationCard,
  NotificationIcon,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
  NotificationActions,
}