// src/components/ui/slider.tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, onValueChange, ...props }, ref) => {
  // We use a local state to give immediate feedback to the user when they drag the slider.
  const [localValue, setLocalValue] = React.useState(value || [0])

  // This effect syncs the local state with the video's actual progress (the external value prop).
  React.useEffect(() => {
    setLocalValue(value || [0])
  }, [value])

  // This function is called ONLY when the user interacts with the slider.
  const handleValueChange = (newValue: number[]) => {
      // It updates the local state for a smooth UI.
      setLocalValue(newValue);
      // It calls the passed onValueChange function to update the video's time.
      if (onValueChange) {
          onValueChange(newValue);
      }
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={localValue}
      onValueChange={handleValueChange}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/30 transition-all group-hover:h-2">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 scale-0 group-hover:scale-100" />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
