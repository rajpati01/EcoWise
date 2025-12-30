import { createContext, useContext, useState, useEffect, useRef, forwardRef } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

// Tooltip Context
const TooltipContext = createContext(null)

const useTooltipContext = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error("Tooltip components must be used within Tooltip")
  }
  return context
}

// TooltipProvider Component
const TooltipProvider = ({ children, delayDuration = 700, skipDelayDuration = 300, disableHoverableContent = false }) => {
  const [lastCloseTime, setLastCloseTime] = useState(0)

  return (
    <TooltipProviderContext.Provider value={{ delayDuration, skipDelayDuration, disableHoverableContent, lastCloseTime, setLastCloseTime }}>
      {children}
    </TooltipProviderContext.Provider>
  )
}
TooltipProvider.displayName = "TooltipProvider"

const TooltipProviderContext = createContext({
  delayDuration: 700,
  skipDelayDuration: 300,
  disableHoverableContent: false,
  lastCloseTime: 0,
  setLastCloseTime: () => {},
})

const useTooltipProviderContext = () => {
  return useContext(TooltipProviderContext)
}

// Root Tooltip Component
const Tooltip = ({ open: controlledOpen, onOpenChange, defaultOpen = false, delayDuration: customDelayDuration, disableHoverableContent: customDisableHoverableContent, children }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const triggerRef = useRef(null)
  const contentRef = useRef(null)
  const openTimeoutRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  const providerContext = useTooltipProviderContext()
  const delayDuration = customDelayDuration ?? providerContext.delayDuration
  const disableHoverableContent = customDisableHoverableContent ?? providerContext.disableHoverableContent

  const handleOpenChange = (newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (!newOpen) {
      providerContext.setLastCloseTime(Date.now())
    }
  }

  const handleOpen = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)

    const timeSinceLastClose = Date.now() - providerContext.lastCloseTime
    const shouldSkipDelay = timeSinceLastClose < providerContext.skipDelayDuration

    if (shouldSkipDelay) {
      handleOpenChange(true)
    } else {
      openTimeoutRef.current = setTimeout(() => {
        handleOpenChange(true)
      }, delayDuration)
    }
  }

  const handleClose = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    
    closeTimeoutRef.current = setTimeout(() => {
      handleOpenChange(false)
    }, 0)
  }

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Close on Escape key
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
    <TooltipContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        triggerRef,
        contentRef,
        handleOpen,
        handleClose,
        disableHoverableContent,
      }}
    >
      {children}
    </TooltipContext.Provider>
  )
}
Tooltip.displayName = "Tooltip"

// TooltipTrigger Component
const TooltipTrigger = forwardRef(({ className, onClick, onMouseEnter, onMouseLeave, onFocus, onBlur, children, asChild, ...props }, ref) => {
  const { triggerRef, handleOpen, handleClose } = useTooltipContext()

  const combinedRef = (node) => {
    triggerRef.current = node
    if (typeof ref === "function") {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  const handleMouseEnter = (e) => {
    handleOpen()
    if (onMouseEnter) onMouseEnter(e)
  }

  const handleMouseLeave = (e) => {
    handleClose()
    if (onMouseLeave) onMouseLeave(e)
  }

  const handleFocus = (e) => {
    handleOpen()
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e) => {
    handleClose()
    if (onBlur) onBlur(e)
  }

  if (asChild && children) {
    const child = Array.isArray(children) ? children[0] : children
    return (
      <child.type
        {...child.props}
        {...props}
        ref={combinedRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(child.props.className, className)}
      />
    )
  }

  return (
    <button
      ref={combinedRef}
      type="button"
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

// TooltipPortal Component
const TooltipPortal = ({ children, container }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(children, container || document.body)
}
TooltipPortal.displayName = "TooltipPortal"

// TooltipContent Component
const TooltipContent = forwardRef(
  ({ className, sideOffset = 4, side = "top", align = "center", onMouseEnter, onMouseLeave, children, ...props }, ref) => {
    const { open, triggerRef, contentRef, handleClose, disableHoverableContent } = useTooltipContext()
    const [position, setPosition] = useState({ top: 0, left: 0 })

    const combinedRef = (node) => {
      contentRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    // Calculate position
    useEffect(() => {
      if (open && triggerRef.current && contentRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const contentRect = contentRef.current.getBoundingClientRect()

        let top = 0
        let left = 0

        // Calculate based on side
        switch (side) {
          case "top":
            top = triggerRect.top - contentRect.height - sideOffset
            left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
            break
          case "bottom":
            top = triggerRect.bottom + sideOffset
            left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
            break
          case "left":
            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
            left = triggerRect.left - contentRect.width - sideOffset
            break
          case "right":
            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
            left = triggerRect.right + sideOffset
            break
        }

        // Adjust based on align
        if (side === "top" || side === "bottom") {
          if (align === "start") {
            left = triggerRect.left
          } else if (align === "end") {
            left = triggerRect.right - contentRect.width
          }
        } else {
          if (align === "start") {
            top = triggerRect.top
          } else if (align === "end") {
            top = triggerRect.bottom - contentRect.height
          }
        }

        // Keep within viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (left + contentRect.width > viewportWidth - 8) {
          left = viewportWidth - contentRect.width - 8
        }
        if (left < 8) {
          left = 8
        }
        if (top + contentRect.height > viewportHeight - 8) {
          top = viewportHeight - contentRect.height - 8
        }
        if (top < 8) {
          top = 8
        }

        setPosition({ top, left })
      }
    }, [open, sideOffset, side, align])

    const handleMouseEnter = (e) => {
      if (!disableHoverableContent && onMouseEnter) {
        onMouseEnter(e)
      }
    }

    const handleMouseLeave = (e) => {
      if (!disableHoverableContent) {
        handleClose()
      }
      if (onMouseLeave) {
        onMouseLeave(e)
      }
    }

    if (!open) return null

    return (
      <TooltipPortal>
        <div
          ref={combinedRef}
          role="tooltip"
          data-state={open ? "open" : "closed"}
          data-side={side}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {children}
        </div>
      </TooltipPortal>
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }