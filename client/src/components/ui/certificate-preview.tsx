import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const CertificatePreview = DialogPrimitive.Root

const CertificatePreviewTrigger = DialogPrimitive.Trigger

const CertificatePreviewPortal = DialogPrimitive.Portal

const CertificatePreviewOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
CertificatePreviewOverlay.displayName = DialogPrimitive.Overlay.displayName

const certificatePreviewVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      position: {
        default: "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        top: "left-[50%] top-0 translate-x-[-50%]",
        bottom: "left-[50%] bottom-0 translate-x-[-50%]",
        left: "left-0 top-[50%] translate-y-[-50%]",
        right: "right-0 top-[50%] translate-y-[-50%]",
      },
      size: {
        default: "w-full max-w-3xl rounded-lg",
        sm: "w-full max-w-xl rounded-lg",
        lg: "w-full max-w-4xl rounded-lg",
        full: "h-screen w-screen",
      },
    },
    defaultVariants: {
      position: "default",
      size: "default",
    },
  }
)

interface CertificatePreviewContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof certificatePreviewVariants> {}

const CertificatePreviewContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  CertificatePreviewContentProps
>(({ className, position, size, ...props }, ref) => (
  <CertificatePreviewPortal>
    <CertificatePreviewOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(certificatePreviewVariants({ position, size }), className)}
      {...props}
    >
      {props.children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </CertificatePreviewPortal>
))
CertificatePreviewContent.displayName = DialogPrimitive.Content.displayName

const CertificatePreviewHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
))
CertificatePreviewHeader.displayName = "CertificatePreviewHeader"

const CertificatePreviewTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CertificatePreviewTitle.displayName = DialogPrimitive.Title.displayName

const CertificatePreviewDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CertificatePreviewDescription.displayName = DialogPrimitive.Description.displayName

const CertificatePreviewFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
))
CertificatePreviewFooter.displayName = "CertificatePreviewFooter"

export {
  CertificatePreview,
  CertificatePreviewTrigger,
  CertificatePreviewContent,
  CertificatePreviewHeader,
  CertificatePreviewTitle,
  CertificatePreviewDescription,
  CertificatePreviewFooter,
}