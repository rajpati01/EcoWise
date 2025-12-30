import { forwardRef, useState, useEffect } from "react"

import { cn } from "@/lib/utils"

// Avatar Root Component
const Avatar = forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

// AvatarImage Component
const AvatarImage = forwardRef(({ className, src, alt = "", onLoadingStatusChange, ...props }, ref) => {
  const [imageStatus, setImageStatus] = useState("idle")

  useEffect(() => {
    if (!src) {
      setImageStatus("error")
      return
    }

    let isMounted = true
    const image = new Image()

    const updateStatus = (status) => {
      if (!isMounted) return
      setImageStatus(status)
      onLoadingStatusChange?.(status)
    }

    image.onload = () => updateStatus("loaded")
    image.onerror = () => updateStatus("error")

    image.src = src
    updateStatus("loading")

    // If image is cached, it might already be loaded
    if (image.complete) {
      updateStatus("loaded")
    }

    return () => {
      isMounted = false
    }
  }, [src, onLoadingStatusChange])

  if (imageStatus !== "loaded") {
    return null
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

// AvatarFallback Component
const AvatarFallback = forwardRef(({ className, delayMs, children, ...props }, ref) => {
  const [canRender, setCanRender] = useState(delayMs === undefined)

  useEffect(() => {
    if (delayMs === undefined) return

    const timer = setTimeout(() => {
      setCanRender(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  if (!canRender) {
    return null
  }

  return (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }