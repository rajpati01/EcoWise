import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const notificationListVariants = cva(
  "w-full overflow-hidden rounded-md",
  {
    variants: {
      variant: {
        default: "bg-background border",
        card: "bg-background shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const NotificationList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof notificationListVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(notificationListVariants({ variant }), className)}
    {...props}
  />
))
NotificationList.displayName = "NotificationList"

const NotificationListHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between border-b px-4 py-3", className)}
    {...props}
  />
))
NotificationListHeader.displayName = "NotificationListHeader"

const NotificationListTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold", className)}
    {...props}
  />
))
NotificationListTitle.displayName = "NotificationListTitle"

const NotificationListContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col divide-y max-h-[450px] overflow-y-auto", className)}
    {...props}
  />
))
NotificationListContent.displayName = "NotificationListContent"

const NotificationListFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center border-t px-4 py-2", className)}
    {...props}
  />
))
NotificationListFooter.displayName = "NotificationListFooter"

export { 
  NotificationList, 
  NotificationListHeader,
  NotificationListTitle,
  NotificationListContent,
  NotificationListFooter 
}