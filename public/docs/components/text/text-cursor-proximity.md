# Text Cursor Proximity

> A text component that animates the letters based on the cursor proximity

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [use-mouse-position-ref](#use-mouse-position-ref)
    - [text-cursor-proximity](#text-cursor-proximity)
- [Understanding the component](#understanding-the-component)
  - [How it works](#how-it-works)
- [Examples](#examples)
  - [Falloff](#falloff)
- [Notes](#notes)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
"use client"

import { useRef } from "react"

import TextCursorProximity from "@/fancy/components/text/text-cursor-proximity"

const styles = {
  title: {
    filter: {
      from: "blur(0px)",
      to: "blur(8px)",
    }
  },
  details: {
    filter: {
      from: "blur(0px)", 
      to: "blur(4px)",
    }
  }
}

export default function Preview() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="w-dvw h-dvh flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 shadow-lg bg-white"
      ref={containerRef}
    >
      <div className="relative min-w-[280px] max-w-[400px] sm:min-w-[350px] h-2/3 sm:h-full overflow-hidden w-full sm:w-4/5 md:w-4/5 lg:w-2/3 justify-between flex-col flex items-start shadow-lg p-4 bg-[#0015ff] text-white select-none">
        <div className="flex flex-col justify-center uppercase -space-y-2">
          <TextCursorProximity
            className="text-xl will-change-transform sm:text-2xl md:text-3xl lg:text-5xl font-overused-grotesk font-bold"
            styles={styles.title}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          >
            DIGITAL
          </TextCursorProximity>
          <TextCursorProximity
            className="text-xl will-change-transform sm:text-2xl md:text-3xl lg:text-5xl font-overused-grotesk font-bold"
            styles={styles.title}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          >
            WORKSHOP
          </TextCursorProximity>
        </div>

        <div className=" flex w-full justify-between font-medium">
          <div className="flex flex-col w-full leading-tight text-xs sm:text-sm md:text-sm lg:text-base ">
            <TextCursorProximity
              className="text-left"
              styles={styles.details}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              LONDON, UK ⟡ 18:30 GMT
            </TextCursorProximity>

            <TextCursorProximity
              className=" text-right"
              styles={styles.details}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              123 DIGITAL STREET, EC1A 1BB ⟶
            </TextCursorProximity>

            <TextCursorProximity
              className="text-left"
              styles={styles.details}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              +44 20 7123 4567 ⟨⟩ INFO@DIGITAL.WORK
            </TextCursorProximity>

            <TextCursorProximity
              className="text-left"
              styles={styles.details}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              @DIGITALWORKSHOP * DIGITAL.WORK®
            </TextCursorProximity>

            <TextCursorProximity
              className="text-right"
              styles={styles.details}
              falloff="exponential"
              radius={70}
              containerRef={containerRef}
            >
              RSVP REQUIRED ⌲ LIMITED SEATS
            </TextCursorProximity>
          </div>
        </div>
      </div>
    </div>
  )
}

```

## Installation 

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/text-cursor-proximity.json"
```

### Manual

Create a hook for querying the cursor/mouse position.

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

This hook actually returns a ref to the position (instead of a state), so we can avoid re-renders when the cursor moves.

Then, copy and paste the following code into your project:

#### text-cursor-proximity

```tsx
"use client"

import React, { CSSProperties, ElementType, forwardRef, useRef, useMemo } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react"

import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"
import { cn } from "@/lib/utils"

// Helper type that makes all properties of CSSProperties accept number | string
type CSSPropertiesWithValues = {
  [K in keyof CSSProperties]: string | number
}

interface StyleValue<T extends keyof CSSPropertiesWithValues> {
  from: CSSPropertiesWithValues[T]
  to: CSSPropertiesWithValues[T]
}

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType

  /**
   * Object containing style properties to animate
   * Each property should have 'from' and 'to' values
   */
  styles: Partial<{
    [K in keyof CSSPropertiesWithValues]: StyleValue<K>
  }>

  /**
   * Reference to the container element for mouse position calculations
   */
  containerRef: React.RefObject<HTMLDivElement>

  /**
   * Radius of the proximity effect in pixels
   * @default 50
   */
  radius?: number

  /**
   * Type of falloff function to use for the proximity effect
   * @default "linear"
   */
  falloff?: "linear" | "exponential" | "gaussian"
}

const TextCursorProximity = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      children,
      as,
      styles,
      containerRef,
      radius = 50,
      falloff = "linear",
      className,
      ...props
    },
    ref
  ) => {
    const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const mousePositionRef = useMousePositionRef(containerRef)

    // Convert children to string for letter processing
    const text = React.Children.toArray(children).join("")

    // Create a motion value for each letter's proximity
    const letterProximities = useRef(
      Array(text.replace(/\s/g, "").length)
        .fill(0)
        .map(() => useMotionValue(0))
    )

    const calculateDistance = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): number => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    const calculateFalloff = (distance: number): number => {
      const normalizedDistance = Math.min(Math.max(1 - distance / radius, 0), 1)

      switch (falloff) {
        case "exponential":
          return Math.pow(normalizedDistance, 2)
        case "gaussian":
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2)
        case "linear":
        default:
          return normalizedDistance
      }
    }

    useAnimationFrame(() => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return

        const rect = letterRef.getBoundingClientRect()
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top

        const distance = calculateDistance(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          letterCenterX,
          letterCenterY
        )

        const proximity = calculateFalloff(distance)
        letterProximities.current[index].set(proximity)
      })
    })

    const words = text.split(" ")
    let letterIndex = 0

    return (
      <MotionComponent
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            className="inline-block"
            aria-hidden={true}
          >
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex++
              const proximity = letterProximities.current[currentLetterIndex]

              // Create transformed values for each style property
              const transformedStyles = Object.entries(styles).reduce(
                (acc, [key, value]) => {
                  acc[key] = useTransform(
                    proximity,
                    [0, 1],
                    [value.from, value.to]
                  )
                  return acc
                },
                {} as Record<string, any>
              )

              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el: HTMLSpanElement | null) => {
                    letterRefs.current[currentLetterIndex] = el
                  }}
                  className="inline-block"
                  aria-hidden="true"
                  style={transformedStyles}
                >
                  {letter}
                </motion.span>
              )
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
        <span className="sr-only">{text}</span>
      </MotionComponent>
    )
  }
)

TextCursorProximity.displayName = "TextCursorProximity"
export default TextCursorProximity

```

## Understanding the component

The `TextCursorProximity` splits its text into letters that respond to cursor movement by adjusting their CSS properties based on the distance between the letter and cursor position.

1. Splitting text into individual letters
2. Tracking cursor position relative to each letter
3. Smoothly transitioning CSS values with motion's `useTransform` hook
4. Supporting multiple falloff patterns for the effect

### How it works

The component calculates the distance between the cursor and each letter in real-time. When the cursor comes within the specified `radius` of a letter, that letter's CSS properties (like scale, color, etc.) smoothly interpolate between two states. For this, we use the `motion` library's `useTransform` hook, which maps the CSS properties from the `styles.*.from` state to the `styles.*.to` state based on the proximity value (which ranges from 0 to 1).

- Default state: (defined in `styles.*.from`)
- Target state (defined in `styles.*.to`)

You can interpolate any value that [motion supports](https://motion.dev/docs/react-animation#animatable-values) (which is actually any CSS value, even those that can't be animated by the browser, like `mask-image`).

The closer the cursor gets to a letter, the closer that letter moves toward its target state.

## Examples

### Falloff

With the `falloff` prop, you can control the type of falloff. It can be either `linear`, `exponential`, or `gaussian`. The following demo showcases the `exponential` one. The effects are best observed on a larger block of text.

Example:

```tsx
"use client"

import { useRef } from "react"

import TextCursorProximity from "@/fancy/components/text/text-cursor-proximity"

export default function Preview() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="w-dvw h-dvh rounded-lg items-center justify-center font-overused-grotesk p-8 sm:p-16 md:p-20 lg:p-24 bg-white cursor-pointer relative overflow-hidden"
      ref={containerRef}
    >
      {/* this is the important stuff */}
      <div className="w-full h-full items-center justify-center grid text-justify">
        <TextCursorProximity
          className="leading-tight text-[#0015ff] text-pretty"
          styles={{
            opacity: { from: 0.1, to: 1 },
          }}
          falloff="linear"
          radius={80}
          containerRef={containerRef}
        >
          Just as every problem is novel and different from others. so the grid
          must be conceived afresh every time so as to meet requirements. This
          means that the designer must approach each new problem with an open
          mind and must seek to solve it by analysing it objectively. The
          difficulties of the task are due to the enormous differences in the
          demands made on the designer by the various assignments he receives. A
          small newspaper advertisement does not present the difficulties of
          designing, say, a daily paper with 10 and more columns. a great
          variety of subjects, and an additional advertising section. Such a
          task calls not only for designing talent but also organizing ability
          since the many constantly changing items of information have to be
          arranged in a logical order and their priorities reflected in
          appropriate typography.
        </TextCursorProximity>
      </div>
    </div>
  )
}

```

## Notes

It seems like interpolating on large number of letters simultaneously can be a bit slow, even when we're avoiding re-renders with state updates. If you're experiencing performance issues, try to limit the length of the text you're animating.

## Credits

Ported to Framer by [Framer University](https://framer.university/)

## Props
| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and animated |
| as | `ElementType` | `"span"` | The HTML element to render the component as |
| styles* | `Partial` | - | CSS properties to animate and their from/to values |
| containerRef* | `React.RefObject` | - | Reference to the container for mouse tracking |
| radius | `number` | `50` | The radius of the proximity effect in pixels |
| falloff | `"linear" | "exponential" | "gaussian"` | `"linear"` | The falloff pattern for the proximity effect |
| className | `string` | - | Additional CSS classes for styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/text-cursor-proximity).*