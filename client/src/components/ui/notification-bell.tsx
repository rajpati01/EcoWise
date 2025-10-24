import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Bell } from "lucide-react"

import { cn } from "../../lib/utils"

const bellVariants = cva(
  "relative inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "text-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const badgePositionVariants = cva(
  "absolute inline-flex items-center justify-center rounded-full text-xs font-bold",
  {
    variants: {
      position: {
        default: "-top-1 -right-1",
        centered: "top-0 right-0",
      },
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      position: "default",
      size: "default",
    },
  }
)

interface NotificationBellProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof bellVariants> {
  badgeContent?: number
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success"
  badgePosition?: "default" | "centered"
  badgeSize?: "default" | "sm" | "lg"
}

const NotificationBell = React.forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ className, variant, size, badgeContent, badgeVariant = "destructive", badgePosition, badgeSize, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(bellVariants({ variant, size }), className)}
      {...props}
    >
      <Bell className="h-5 w-5" />
      {badgeContent && badgeContent > 0 ? (
        <span 
          className={cn(
            badgePositionVariants({ position: badgePosition, size: badgeSize }),
            "bg-destructive text-destructive-foreground",
            badgeVariant === "secondary" && "bg-secondary text-secondary-foreground",
            badgeVariant === "success" && "bg-green-500 text-white",
          )}
        >
          {badgeContent > 99 ? "99+" : badgeContent}
        </span>
      ) : null}
    </button>
  )
)
NotificationBell.displayName = "NotificationBell"

export { NotificationBell }