# Variable Font And Cursor

> A text component that animates the font variation settings based on the cursor position. Works only with variable fonts.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [use-mouse-position-ref](#use-mouse-position-ref)
    - [variable-font-and-cursor](#variable-font-and-cursor)
- [Usage](#usage)
  - [Font Variation Mapping](#font-variation-mapping)
  - [Font variation mapping settings](#font-variation-mapping-settings)
  - [Understanding Variable Fonts](#understanding-variable-fonts)
- [Notes](#notes)
- [Props](#props)
- [Interfaces](#interfaces)
  - [FontVariationMapping](#fontvariationmapping)
  - [FontVariationAxis](#fontvariationaxis)

Example:

```tsx
"use client"

import { useRef } from "react"

import { useMousePosition } from "@/hooks/use-mouse-position"
import VariableFontAndCursor from "@/fancy/components/text/variable-font-and-cursor"

export default function Preview() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { x, y } = useMousePosition(containerRef)

  return (
    <div
      className="w-dvw h-dvh rounded-lg items-center justify-center font-overused-grotesk p-24 bg-background relative cursor-none overflow-hidden"
      ref={containerRef}
    >
      {/* this is the important stuff */}
      <div className="w-full h-full items-center justify-center flex">
        <VariableFontAndCursor
          className="text-5xl sm:text-7xl md:text-9xl text-[#f97316]"
          fontVariationMapping={{
            y: { name: "wght", min: 100, max: 900 },
            x: { name: "slnt", min: 0, max: -10 },
          }}
          containerRef={containerRef}
        >
          fancy!
        </VariableFontAndCursor>
      </div>

      {/* this is just fluff for the demo */}

      <div className="absolute bottom-8 left-8 flex flex-col font-azeret-mono">
        <span className="text-xs text-foreground/60 tabular-nums">
          x: {Math.round(x)}
        </span>
        <span className="text-xs text-foreground/60 tabular-nums">
          y: {Math.round(y)}
        </span>
      </div>

      <div
        className="absolute w-px h-screen bg-foreground/20 dark:bg-foreground top-0 -translate-x-1/2"
        style={{
          left: `${x}px`,
        }}
      />
      <div
        className="absolute w-screen h-px bg-foreground/20 dark:bg-foreground left-0 -translate-y-1/2"
        style={{
          top: `${y}px`,
        }}
      />
      <div
        className="absolute w-2 h-2 bg-[#f97316] -translate-x-1/2 -translate-y-1/2 rounded-xs"
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
      />
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/variable-font-and-cursor.json"
```

### Manual

Create this hook to query the cursor position's ref:

#### use-mouse-position-ref

```tsx
import { RefObject, useEffect, useRef } from "react"

export const useMousePositionRef = (
  containerRef?: RefObject<HTMLElement | SVGElement>
) => {
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeX = x - rect.left
        const relativeY = y - rect.top

        // Calculate relative position even when outside the container
        positionRef.current = { x: relativeX, y: relativeY }
      } else {
        positionRef.current = { x, y }
      }
    }

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY)
    }

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }

    // Listen for both mouse and touch events
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [containerRef])

  return positionRef
}

```

Then, copy and paste the following code into your project:

#### variable-font-and-cursor

```tsx
"use client"

import React, { ElementType, useCallback, useRef } from "react"
import { motion, useAnimationFrame } from "motion/react"

import { cn } from "@/lib/utils"
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"

/**
 * Interface for defining a single font variation axis.
 * Each axis represents a dimension of variation in a variable font. You should check the font variation settings of the font you are using to see the available axes.
 */
interface FontVariationAxis {
  /**
   * The name of the font variation axis (e.g., "wght" for weight, "slnt" for slant).
   * This corresponds to the OpenType variation axis tags, but can be arbitrary. Make sure to check the font variation settings of the font you are using to see the available axes.
   */
  name: string

  /**
   * The minimum value for this axis.
   * Applied when the cursor is at the left edge (for x-axis) or top edge (for y-axis).
   */
  min: number

  /**
   * The maximum value for this axis.
   * Applied when the cursor is at the right edge (for x-axis) or bottom edge (for y-axis).
   */
  max: number
}

/**
 * Interface for mapping cursor position to font variation settings.
 * Allows independent control of two font variation axes based on cursor movement.
 */
interface FontVariationMapping {
  /**
   * Font variation axis controlled by horizontal cursor movement.
   */
  x: FontVariationAxis

  /**
   * Font variation axis controlled by vertical cursor movement.
   */
  y: FontVariationAxis
}

/**
 * Props for the VariableFontAndCursor component.
 */
interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The text content to display and animate.
   * Required prop with no default value.
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as.
   * @default "span"
   */
  as?: ElementType

  /**
   * Mapping configuration that defines how cursor position affects font variation settings.
   * Maps x and y cursor positions to specific font variation axes and value ranges.
   * Required prop with no default value.
   */
  fontVariationMapping: FontVariationMapping

  /**
   * Reference to the container element for mouse tracking.
   * The cursor position will be calculated relative to this container's bounds.
   * Required prop with no default value.
   */
  containerRef: React.RefObject<HTMLDivElement>
}

const VariableFontAndCursor = ({
  children,
  as = "span",
  fontVariationMapping,
  className,
  containerRef,
  ...props
}: TextProps) => {
  // Hook to track mouse position relative to the specified container
  const mousePositionRef = useMousePositionRef(containerRef)

  // Ref for the visible text span to apply font variation settings
  const spanRef = useRef<HTMLSpanElement>(null)

  /**
   * Calculates font variation settings based on cursor position within the container.
   *
   * This function maps the cursor's x and y coordinates to font variation values
   * by interpolating between the minimum and maximum values defined in the mapping.
   * The position is normalized to a 0-1 range based on the container dimensions.
   *
   * @param xPosition - Horizontal cursor position relative to container
   * @param yPosition - Vertical cursor position relative to container
   * @returns CSS font-variation-settings string with calculated values
   */
  const interpolateFontVariationSettings = useCallback(
    (xPosition: number, yPosition: number) => {
      const container = containerRef.current
      if (!container) return "0 0" // Return default values if container is null

      // Get container dimensions for normalization
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // Normalize cursor position to 0-1 range, clamped to container bounds
      const xProgress = Math.min(Math.max(xPosition / containerWidth, 0), 1)
      const yProgress = Math.min(Math.max(yPosition / containerHeight, 0), 1)

      // Interpolate between min and max values for each axis
      const xValue =
        fontVariationMapping.x.min +
        (fontVariationMapping.x.max - fontVariationMapping.x.min) * xProgress
      const yValue =
        fontVariationMapping.y.min +
        (fontVariationMapping.y.max - fontVariationMapping.y.min) * yProgress

      // Return CSS font-variation-settings string
      return `'${fontVariationMapping.x.name}' ${xValue}, '${fontVariationMapping.y.name}' ${yValue}`
    },
    [fontVariationMapping, containerRef]
  )

  // Use animation frame to smoothly update font variations on every frame
  // This ensures smooth transitions as the cursor moves
  useAnimationFrame(() => {
    const settings = interpolateFontVariationSettings(
      mousePositionRef.current.x,
      mousePositionRef.current.y
    )
    if (spanRef.current) {
      spanRef.current.style.fontVariationSettings = settings
    }
  })

  // Custom motion component to render as the specified HTML tag
  const MotionComponent = motion.create(as)

  return (
    <MotionComponent
      className={cn(className)}
      data-text={children}
      ref={spanRef}
      {...props}
    >
      <span className="inline-block">{children}</span>
    </MotionComponent>
  )
}

export default VariableFontAndCursor

```

## Usage

The `VariableFontAndCursor` component allows you to create text that responds to cursor movement by adjusting its font variation settings. This component works with variable fonts and can track cursor movement either within a specific container or across the entire viewport.

It's important to note that the container used for tracking mouse position is not part of the component itself. To track mouse movement within a specific area, you need to create a container element, assign it a ref, and pass that ref to the component using the `containerRef` prop. You can use the window object as a reference to the entire viewport.

### Font Variation Mapping

The `fontVariationMapping` prop allows you to define how cursor position maps to font variation settings. It has the following structure:

### Font variation mapping settings

```tsx
interface FontVariationMapping {
  x: { name: string; min: number; max: number };
  y: { name: string; min: number; max: number };
}
```

- `x`: Defines the font variation axis controlled by horizontal cursor movement.
- `y`: Defines the font variation axis controlled by vertical cursor movement.
- `name`: The name of the font variation axis (e.g., "wght" for weight, "slnt" for slant, see next section for more details).
- `min`: The minimum value for the axis, applied when the cursor is at the left/top.
- `max`: The maximum value for the axis, applied when the cursor is at the right/bottom.

The component interpolates between `min` and `max` based on the cursor position within the tracking area.

### Understanding Variable Fonts

For more information about variable fonts and how they work, please refer to the [Variable Font Hover By Letter](https://uwuui.com/docs/components/text/variable-font-hover-by-letter#understanding-variable-fonts.md) documentation.

## Notes

Make sure the main container has enough space to hold the text at its full weight to avoid layout shifts. For example, you can use negative margins, or an invisible pseudo element.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The text content to display and animate |
| as | `ElementType` | `"span"` | HTML tag to render the component as |
| fontVariationMapping* | `FontVariationMapping` | - | Mapping of cursor position to font variation settings |
| containerRef* | `React.RefObject` | - | Reference to the container for mouse tracking |
| className | `string` | - | Additional CSS classes for styling |

## Interfaces

### FontVariationMapping

| Property | Type | Description |
|----------|----------|----------|
| x | `FontVariationAxis` | Font variation settings for horizontal cursor movement |
| y | `FontVariationAxis` | Font variation settings for vertical cursor movement |

### FontVariationAxis

| Property | Type | Description |
|----------|----------|----------|
| name | `string` | Name of the font variation axis (e.g., "wght", "slnt") |
| min | `number` | Minimum value for the axis |
| max | `number` | Maximum value for the axis |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/variable-font-and-cursor).*