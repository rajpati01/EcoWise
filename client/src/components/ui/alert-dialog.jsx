import { createContext, useContext, useState, useEffect, forwardRef } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

// Context for AlertDialog
const AlertDialogContext = createContext(null)

const useAlertDialogContext = () => {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog")
  }
  return context
}

// Root AlertDialog Component
const AlertDialog = ({ open: controlledOpen, onOpenChange, defaultOpen = false, children }) => {
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
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        handleOpenChange(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open])

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

// AlertDialogTrigger Component
const AlertDialogTrigger = forwardRef(({ className, onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange } = useAlertDialogContext()

  const handleClick = (e) => {
    onOpenChange(true)
    if (onClick) {
      onClick(e)
    }
  }

  if (asChild && children) {
    // Clone child and add click handler
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
AlertDialogTrigger.displayName = "AlertDialogTrigger"

// AlertDialogPortal Component
const AlertDialogPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(children, document.body)
}
AlertDialogPortal.displayName = "AlertDialogPortal"

// AlertDialogOverlay Component
const AlertDialogOverlay = forwardRef(({ className, ...props }, ref) => {
  const { open, onOpenChange } = useAlertDialogContext()

  if (!open) return null

  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
})
AlertDialogOverlay.displayName = "AlertDialogOverlay"

// AlertDialogContent Component
const AlertDialogContent = forwardRef(({ className, children, ...props }, ref) => {
  const { open } = useAlertDialogContext()

  if (!open) return null

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

// AlertDialogHeader Component
const AlertDialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

// AlertDialogFooter Component
const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

// AlertDialogTitle Component
const AlertDialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    id="alert-dialog-title"
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

// AlertDialogDescription Component
const AlertDialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    id="alert-dialog-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

// AlertDialogAction Component
const AlertDialogAction = forwardRef(({ className, onClick, ...props }, ref) => {
  const { onOpenChange } = useAlertDialogContext()

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    // Close dialog after action
    onOpenChange(false)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(buttonVariants(), className)}
      onClick={handleClick}
      {...props}
    />
  )
})
AlertDialogAction.displayName = "AlertDialogAction"

// AlertDialogCancel Component
const AlertDialogCancel = forwardRef(({ className, onClick, ...props }, ref) => {
  const { onOpenChange } = useAlertDialogContext()

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    onOpenChange(false)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}