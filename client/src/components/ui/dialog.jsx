import { createContext, useContext, useState, useEffect, forwardRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Context for Dialog
const DialogContext = createContext(null)

const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within Dialog")
  }
  return context
}

// Root Dialog Component
const Dialog = ({ open: controlledOpen, onOpenChange, defaultOpen = false, modal = true, children }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open && modal) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [open, modal])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        handleOpenChange(false)
      }
    }
    
    if (open) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange, modal }}>
      {children}
    </DialogContext.Provider>
  )
}
Dialog.displayName = "Dialog"

// DialogTrigger Component
const DialogTrigger = forwardRef(({ className, onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange } = useDialogContext()

  const handleClick = (e) => {
    onOpenChange(true)
    if (onClick) {
      onClick(e)
    }
  }

  if (asChild && children) {
    const child = Array.isArray(children) ? children[0] : children
    return (
      <child.type
        {...child.props}
        {...props}
        ref={ref}
        onClick={handleClick}
        className={cn(child.props.className, className)}
      />
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

// DialogPortal Component
const DialogPortal = ({ children, container }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(children, container || document.body)
}
DialogPortal.displayName = "DialogPortal"

// DialogOverlay Component
const DialogOverlay = forwardRef(({ className, ...props }, ref) => {
  const { open, onOpenChange, modal } = useDialogContext()

  if (!open) return null

  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      onClick={() => modal && onOpenChange(false)}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

// DialogClose Component
const DialogClose = forwardRef(({ className, onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange } = useDialogContext()

  const handleClick = (e) => {
    onOpenChange(false)
    if (onClick) {
      onClick(e)
    }
  }

  if (asChild && children) {
    const child = Array.isArray(children) ? children[0] : children
    return (
      <child.type
        {...child.props}
        {...props}
        ref={ref}
        onClick={handleClick}
        className={cn(child.props.className, className)}
      />
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
DialogClose.displayName = "DialogClose"

// DialogContent Component
const DialogContent = forwardRef(({ className, children, ...props }, ref) => {
  const { open } = useDialogContext()
  const contentRef = ref || null

  // Focus management
  useEffect(() => {
    if (open && contentRef?.current) {
      // Focus first focusable element
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  }, [open, contentRef])

  if (!open) return null

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

// DialogHeader Component
const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// DialogFooter Component
const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

// DialogTitle Component
const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    id="dialog-title"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

// DialogDescription Component
const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    id="dialog-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}