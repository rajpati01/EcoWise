import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const certificateCardVariants = cva(
  "relative overflow-hidden rounded-xl border shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        achievement: "bg-gradient-to-br from-blue-50 to-green-50 text-foreground",
        eco: "bg-gradient-to-br from-green-50 to-teal-50 text-foreground",
        premium: "bg-gradient-to-br from-amber-50 to-yellow-50 text-foreground",
        master: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-foreground",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface CertificateCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof certificateCardVariants> {}

const CertificateCard = React.forwardRef<
  HTMLDivElement,
  CertificateCardProps
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(certificateCardVariants({ variant, size }), className)}
    {...props}
  />
))
CertificateCard.displayName = "CertificateCard"

const CertificateHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center mb-4", className)}
    {...props}
  />
))
CertificateHeader.displayName = "CertificateHeader"

const CertificateTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-2xl font-bold text-center tracking-tight", className)}
    {...props}
  />
))
CertificateTitle.displayName = "CertificateTitle"

const CertificateContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center gap-4", className)}
    {...props}
  />
))
CertificateContent.displayName = "CertificateContent"

const CertificateRecipient = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-medium text-center", className)}
    {...props}
  />
))
CertificateRecipient.displayName = "CertificateRecipient"

const CertificateAchievement = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-lg text-center text-muted-foreground", className)}
    {...props}
  />
))
CertificateAchievement.displayName = "CertificateAchievement"

const CertificateDate = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-center text-muted-foreground", className)}
    {...props}
  />
))
CertificateDate.displayName = "CertificateDate"

const CertificateSignature = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center mt-6", className)}
    {...props}
  />
))
CertificateSignature.displayName = "CertificateSignature"

const CertificateActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-2 mt-6", className)}
    {...props}
  />
))
CertificateActions.displayName = "CertificateActions"

export {
  CertificateCard,
  CertificateHeader,
  CertificateTitle,
  CertificateContent,
  CertificateRecipient,
  CertificateAchievement,
  CertificateDate,
  CertificateSignature,
  CertificateActions,
}