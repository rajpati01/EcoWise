import { forwardRef, useState } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = forwardRef(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      required = false,
      name,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : internalChecked

    const handleChange = (e) => {
      const newChecked = e.target.checked

      if (!isControlled) {
        setInternalChecked(newChecked)
      }

      if (onCheckedChange) {
        onCheckedChange(newChecked)
      }
    }

    const handleKeyDown = (e) => {
      // Space key toggles checkbox
      if (e.key === " " && !disabled) {
        e.preventDefault()
        const newChecked = !checked

        if (!isControlled) {
          setInternalChecked(newChecked)
        }

        if (onCheckedChange) {
          onCheckedChange(newChecked)
        }
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-required={required}
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        disabled={disabled}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked && "bg-primary text-primary-foreground",
          className
        )}
        onClick={(e) => {
          e.preventDefault()
          if (!disabled) {
            const newChecked = !checked

            if (!isControlled) {
              setInternalChecked(newChecked)
            }

            if (onCheckedChange) {
              onCheckedChange(newChecked)
            }
          }
        }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Hidden native input for form compatibility */}
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          id={id}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {/* Check indicator */}
        <span
          className={cn(
            "flex items-center justify-center text-current transition-transform",
            checked ? "scale-100" : "scale-0"
          )}
        >
          <Check className="h-4 w-4" />
        </span>
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }