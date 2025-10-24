import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"

const NotificationDropdown = PopoverPrimitive.Root

const NotificationDropdownTrigger = PopoverPrimitive.Trigger

const notificationDropdownContentVariants = cva(
  "z-50 w-72 rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        default: "w-72",
        sm: "w-64",
        md: "w-80",
        lg: "w-96",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const NotificationDropdownContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & 
  VariantProps<typeof notificationDropdownContentVariants>
>(({ className, size, align = "end", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(notificationDropdownContentVariants({ size }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
NotificationDropdownContent.displayName = PopoverPrimitive.Content.displayName

export {
  NotificationDropdown,
  NotificationDropdownTrigger,
  NotificationDropdownContent
}