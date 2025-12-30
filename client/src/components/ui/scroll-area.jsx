import { forwardRef, useRef, useState, useEffect } from "react"

import { cn } from "@/lib/utils"

const ScrollArea = forwardRef(({ className, children, ...props }, ref) => {
  const viewportRef = useRef(null)
  const [scrollbarVisible, setScrollbarVisible] = useState(false)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const checkScrollable = () => {
      setScrollbarVisible(viewport.scrollHeight > viewport.clientHeight)
    }

    checkScrollable()
    const resizeObserver = new ResizeObserver(checkScrollable)
    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [children])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      <div
        ref={viewportRef}
        className="h-full w-full rounded-[inherit] overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "hsl(var(--border)) transparent",
        }}
      >
        {children}
      </div>
      {scrollbarVisible && <ScrollBar viewportRef={viewportRef} />}
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"

const ScrollBar = forwardRef(
  ({ className, orientation = "vertical", viewportRef, ...props }, ref) => {
    const scrollbarRef = useRef(null)
    const thumbRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [thumbSize, setThumbSize] = useState(0)
    const [thumbPosition, setThumbPosition] = useState(0)

    // Calculate thumb size and position
    useEffect(() => {
      const viewport = viewportRef?.current
      if (!viewport) return

      const updateScrollbar = () => {
        if (orientation === "vertical") {
          const scrollRatio = viewport.clientHeight / viewport.scrollHeight
          const newThumbSize = Math.max(scrollRatio * viewport.clientHeight, 20)
          const scrollPercentage = viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight)
          const maxThumbPosition = viewport.clientHeight - newThumbSize
          const newThumbPosition = scrollPercentage * maxThumbPosition

          setThumbSize(newThumbSize)
          setThumbPosition(newThumbPosition)
        } else {
          const scrollRatio = viewport.clientWidth / viewport.scrollWidth
          const newThumbSize = Math.max(scrollRatio * viewport.clientWidth, 20)
          const scrollPercentage = viewport.scrollLeft / (viewport.scrollWidth - viewport.clientWidth)
          const maxThumbPosition = viewport.clientWidth - newThumbSize
          const newThumbPosition = scrollPercentage * maxThumbPosition

          setThumbSize(newThumbSize)
          setThumbPosition(newThumbPosition)
        }
      }

      updateScrollbar()
      viewport.addEventListener("scroll", updateScrollbar)
      
      const resizeObserver = new ResizeObserver(updateScrollbar)
      resizeObserver.observe(viewport)

      return () => {
        viewport.removeEventListener("scroll", updateScrollbar)
        resizeObserver.disconnect()
      }
    }, [viewportRef, orientation])

    // Handle drag
    useEffect(() => {
      if (!isDragging) return

      const viewport = viewportRef?.current
      if (!viewport) return

      const handleMouseMove = (e) => {
        const scrollbar = scrollbarRef.current
        if (!scrollbar) return

        if (orientation === "vertical") {
          const scrollbarRect = scrollbar.getBoundingClientRect()
          const mouseY = e.clientY - scrollbarRect.top
          const scrollbarHeight = scrollbar.clientHeight
          const scrollPercentage = Math.max(0, Math.min(1, mouseY / scrollbarHeight))
          
          viewport.scrollTop = scrollPercentage * (viewport.scrollHeight - viewport.clientHeight)
        } else {
          const scrollbarRect = scrollbar.getBoundingClientRect()
          const mouseX = e.clientX - scrollbarRect.left
          const scrollbarWidth = scrollbar.clientWidth
          const scrollPercentage = Math.max(0, Math.min(1, mouseX / scrollbarWidth))
          
          viewport.scrollLeft = scrollPercentage * (viewport.scrollWidth - viewport.clientWidth)
        }
      }

      const handleMouseUp = () => {
        setIsDragging(false)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isDragging, viewportRef, orientation])

    const handleThumbMouseDown = (e) => {
      e.preventDefault()
      setIsDragging(true)
    }

    return (
      <div
        ref={scrollbarRef}
        className={cn(
          "flex touch-none select-none transition-colors",
          orientation === "vertical" &&
            "absolute right-0 top-0 h-full w-2.5 border-l border-l-transparent p-[1px]",
          orientation === "horizontal" &&
            "absolute bottom-0 left-0 h-2.5 w-full flex-col border-t border-t-transparent p-[1px]",
          className
        )}
        {...props}
      >
        <div
          ref={thumbRef}
          className={cn(
            "relative rounded-full bg-border hover:bg-border/80 transition-colors cursor-pointer",
            isDragging && "bg-border/80"
          )}
          style={
            orientation === "vertical"
              ? { height: `${thumbSize}px`, transform: `translateY(${thumbPosition}px)` }
              : { width: `${thumbSize}px`, transform: `translateX(${thumbPosition}px)` }
          }
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    )
  }
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }