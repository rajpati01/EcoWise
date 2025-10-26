import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const certificateBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        beginner: "bg-green-100 text-green-700",
        explorer: "bg-blue-100 text-blue-700",
        warrior: "bg-purple-100 text-purple-700",
        champion: "bg-amber-100 text-amber-700",
        master: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
      },
      size: {
        default: "h-24 w-24",
        sm: "h-16 w-16",
        lg: "h-32 w-32",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const certificateBadgeLabelVariants = cva(
  "font-semibold text-center",
  {
    variants: {
      size: {
        default: "text-base",
        sm: "text-sm",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface CertificateBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof certificateBadgeVariants> {
  label?: string
}

const CertificateBadge = React.forwardRef<HTMLDivElement, CertificateBadgeProps>(
  ({ className, variant, size, label, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(certificateBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {label && (
        <span className={cn(certificateBadgeLabelVariants({ size }))}>
          {label}
        </span>
      )}
    </div>
  )
)
CertificateBadge.displayName = "CertificateBadge"

export { CertificateBadge }