"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",

        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "hover:bg-muted hover:text-foreground",

        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",

        link: "text-primary underline-offset-4 hover:underline",

        // ✅ YOUR BRAND BUTTONS
        brandPrimary:
          "bg-[#adc6ff] text-[#002e6a] font-bold px-6 py-3 rounded-2xl shadow-xl hover:bg-[#adc6ff]/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(173,198,255,0.5)]",

        brandSecondary:
          "bg-[#6ffbbe] text-[#003d2e] font-bold px-6 py-3 rounded-2xl shadow-xl hover:bg-[#6ffbbe]/90 hover:scale-105 hover:shadow-[0_0_30px_rgba(111,251,190,0.5)]",
      },

      size: {
        default: "h-8 px-3 text-sm",
        sm: "h-7 px-2.5 text-xs",
        lg: "h-10 px-5 text-base",
        icon: "size-8",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
