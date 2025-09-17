"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const speedDialVariants = cva("absolute flex items-center justify-center gap-2", {
  variants: {
    direction: {
      up: "bottom-full mb-2 flex-col-reverse",
      down: "top-full mt-2 flex-col",
      left: "right-full mr-2 flex-row-reverse",
      right: "left-full ml-2 flex-row",
    },
  },
  defaultVariants: {
    direction: "up",
  },
})

const triggerVariants = cva("shadow-lg transition-transform duration-300 p-0", {
  variants: {
    style: {
      square: "rounded-lg",
      circle: "rounded-full",
    },
    size: {
      xs: "h-8 w-8",
      sm: "h-9 w-9",
      default: "h-10 w-10",
      lg: "h-11 w-11",
    },
  },
  defaultVariants: {
    style: "square",
    size: "default",
  },
})

const actionButtonVariants = cva("rounded-full shadow-md", {
  variants: {
    size: {
      xs: "h-8 w-8",
      sm: "h-9 w-9",
      default: "h-10 w-10",
      lg: "h-11 w-11",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const actionIconVariants = cva("", {
  variants: {
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const triggerIconVariants = cva("transition-transform duration-300", {
  variants: {
    size: {
      xs: "h-4 w-4",
      sm: "h-5 w-5",
      default: "h-6 w-6",
      lg: "h-7 w-7",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface SpeedDialAction {
  icon: React.ElementType
  label: string
  onClick: () => void
  className?: string
}

type SpeedDialSize = "xs" | "sm" | "default" | "lg"

interface SpeedDialProps extends VariantProps<typeof speedDialVariants> {
  actions: SpeedDialAction[]
  disabled?: boolean
  className?: string
  triggerProps?: ButtonProps
  triggerOn?: "click" | "hover"
  triggerSize?: SpeedDialSize
  actionSize?: SpeedDialSize
  triggerIcon?: React.ElementType
  style?: "square" | "circle"
}

export function SpeedDial({
  actions,
  direction,
  disabled,
  className,
  triggerProps,
  triggerOn = "click",
  triggerSize = "default",
  actionSize,
  triggerIcon: TriggerIcon = Plus,
  style = "square",
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  // Use actionSize if provided, otherwise fall back to triggerSize
  const effectiveActionSize = actionSize || triggerSize

  const handleTrigger = () => {
    if (triggerOn === "click") {
      setIsOpen(!isOpen)
    }
  }

  const handleTriggerMouseEnter = () => {
    if (triggerOn === "hover" && !disabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsOpen(true)
    }
  }

  const handleTriggerMouseLeave = () => {
    if (triggerOn === "hover" && !disabled) {
      // Add a delay to allow moving to menu items
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 150)
    }
  }

  const handleMenuMouseEnter = () => {
    if (triggerOn === "hover" && !disabled) {
      // Cancel the close timeout when hovering over menu items
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }

  const handleMenuMouseLeave = () => {
    if (triggerOn === "hover" && !disabled) {
      // Close the menu when leaving menu items
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 100)
    }
  }

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const tooltipSide = {
    up: "left",
    down: "left",
    left: "top",
    right: "top",
  }[direction || "up"]

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn("relative flex items-center justify-center", className)}>
        <div
          className={speedDialVariants({ direction })}
          onMouseEnter={triggerOn === "hover" ? handleMenuMouseEnter : undefined}
          onMouseLeave={triggerOn === "hover" ? handleMenuMouseLeave : undefined}
        >
          {actions.map((action, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-300 ease-in-out flex items-center justify-center",
                isOpen ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 pointer-events-none",
                direction === "up" && !isOpen && "translate-y-2",
                direction === "down" && !isOpen && "-translate-y-2",
                direction === "left" && !isOpen && "translate-x-2",
                direction === "right" && !isOpen && "-translate-x-2",
              )}
              style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(actionButtonVariants({ size: effectiveActionSize }), action.className)}
                    onClick={() => {
                      action.onClick()
                      if (triggerOn === "click") {
                        setIsOpen(false)
                      }
                    }}
                    aria-label={action.label}
                    disabled={disabled}
                  >
                    <action.icon className={actionIconVariants({ size: effectiveActionSize })} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>

        <Button
          onClick={handleTrigger}
          onMouseEnter={triggerOn === "hover" ? handleTriggerMouseEnter : undefined}
          onMouseLeave={triggerOn === "hover" ? handleTriggerMouseLeave : undefined}
          size="icon"
          className={cn(triggerVariants({ style, size: triggerSize }), triggerProps?.className)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close speed dial" : "Open speed dial"}
          disabled={disabled}
          {...triggerProps}
        >
          <TriggerIcon className={cn(triggerIconVariants({ size: triggerSize }), isOpen && "rotate-45")} />
        </Button>
      </div>
    </TooltipProvider>
  )
}
