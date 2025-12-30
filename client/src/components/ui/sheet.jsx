import { createContext, useContext, useState, useEffect, forwardRef } from "react"
import { createPortal } from "react-dom"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Context for Sheet
const SheetContext = createContext(null)

const useSheetContext = () => {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error("Sheet components must be used within Sheet")
  }
  return context
}

// Root Sheet Component
const Sheet = ({ open: controlledOpen, onOpenChange, defaultOpen = false, modal = true, children }) => {
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

  // Prevent body scroll when sheet is open
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
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange, modal }}>
      {children}
    </SheetContext.Provider>
  )
}
Sheet.displayName = "Sheet"

// SheetTrigger Component
const SheetTrigger = forwardRef(({ className, onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange } = useSheetContext()

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
SheetTrigger.displayName = "SheetTrigger"

// SheetPortal Component
const SheetPortal = ({ children, container }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(children, container || document.body)
}
SheetPortal.displayName = "SheetPortal"

// SheetOverlay Component
const SheetOverlay = forwardRef(({ className, ...props }, ref) => {
  const { open, onOpenChange, modal } = useSheetContext()

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
SheetOverlay.displayName = "SheetOverlay"

// SheetClose Component
const SheetClose = forwardRef(({ className, onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange } = useSheetContext()

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
SheetClose.displayName = "SheetClose"

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

// SheetContent Component
const SheetContent = forwardRef(
  ({ side = "right", className, children, ...props }, ref) => {
    const { open } = useSheetContext()

    if (!open) return null

    return (
      <SheetPortal>
        <SheetOverlay />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          aria-describedby="sheet-description"
          data-state={open ? "open" : "closed"}
          className={cn(sheetVariants({ side }), className)}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
      </SheetPortal>
    )
  }
)
SheetContent.displayName = "SheetContent"

// SheetHeader Component
const SheetHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

// SheetFooter Component
const SheetFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

// SheetTitle Component
const SheetTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    id="sheet-title"
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

// SheetDescription Component
const SheetDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    id="sheet-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}