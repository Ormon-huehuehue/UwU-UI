# Parallax Floating

> A component that creates a parallax floating effect on cursor/touch movement. Works also with videos, svgs, or any type of html elements.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [use-mouse-position](#use-mouse-position)
    - [parallax-floating](#parallax-floating)
- [Usage](#usage)
  - [Floating Example](#floating-example)
- [Understanding the component](#understanding-the-component)
- [Notes](#notes)
  - [Z-Index Management](#z-index-management)
  - [Performance Optimization](#performance-optimization)
  - [Directional Control](#directional-control)
- [Credits](#credits)
- [Props](#props)
  - [FloatingElement](#floatingelement)

Example:

```tsx
"use client"

import { useEffect } from "react"
import { exampleImages } from "@/utils/demo-images"
import { motion, stagger, useAnimate } from "motion/react"

import Floating, {
  FloatingElement,
} from "@/fancy/components/image/parallax-floating"

const Preview = () => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [])

  return (
    <div
      className="flex w-dvw h-dvh justify-center items-center bg-black overflow-hidden"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="text-5xl md:text-7xl z-50 text-white font-calendas italic">
          fancy.
        </p>
        <p className="text-xs z-50 hover:scale-110 transition-transform bg-white text-black rounded-full py-2 w-20 cursor-pointer">
          Download
        </p>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].url}
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].url}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].url}
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

export default Preview

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/parallax-floating.json"
```

### Manual

Create a hook for querying the cursor position:

#### use-mouse-position

```tsx
import { RefObject, useEffect, useState } from "react"

export const useMousePosition = (
  containerRef?: RefObject<HTMLElement | SVGElement | null>
) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeX = x - rect.left
        const relativeY = y - rect.top

        // Calculate relative position even when outside the container
        setPosition({ x: relativeX, y: relativeY })
      } else {
        setPosition({ x, y })
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

  return position
}

```

Then copy and paste the following code into your project:

#### parallax-floating

```tsx
"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import { useAnimationFrame } from "motion/react"

import { cn } from "@/lib/utils"
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void
  unregisterElement: (id: string) => void
}

const FloatingContext = createContext<FloatingContextType | null>(null)

interface FloatingProps {
  children: ReactNode
  className?: string
  sensitivity?: number
  easingFactor?: number
}

const Floating = ({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
  ...props
}: FloatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement
        depth: number
        currentPosition: { x: number; y: number }
      }
    >()
  )
  const mousePositionRef = useMousePositionRef(containerRef)

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      elementsMap.current.set(id, {
        element,
        depth,
        currentPosition: { x: 0, y: 0 },
      })
    },
    []
  )

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id)
  }, [])

  useAnimationFrame(() => {
    if (!containerRef.current) return

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20

      // Calculate new target position
      const newTargetX = mousePositionRef.current.x * strength
      const newTargetY = mousePositionRef.current.y * strength

      // Check if we need to update
      const dx = newTargetX - data.currentPosition.x
      const dy = newTargetY - data.currentPosition.y

      // Update position only if we're still moving
      data.currentPosition.x += dx * easingFactor
      data.currentPosition.y += dy * easingFactor

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`
    })
  })

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={containerRef}
        className={cn("absolute top-0 left-0 w-full h-full", className)}
        {...props}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  )
}

export default Floating

interface FloatingElementProps {
  children: ReactNode
  className?: string
  depth?: number
}

export const FloatingElement = ({
  children,
  className,
  depth = 1,
}: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(Math.random().toString(36).substring(7))
  const context = useContext(FloatingContext)

  useEffect(() => {
    if (!elementRef.current || !context) return

    const nonNullDepth = depth ?? 0.01

    context.registerElement(idRef.current, elementRef.current, nonNullDepth)
    return () => context.unregisterElement(idRef.current)
  }, [depth])

  return (
    <div
      ref={elementRef}
      className={cn("absolute will-change-transform", className)}
    >
      {children}
    </div>
  )
}

```

## Usage

There are two components exported from the source file: `Floating` and `FloatingElement`. The first one is a wrapper component that takes care of the animation, mouse position tracking and other logic. The second one is a component that you **must** use to wrap any elements you want to float.

### Floating Example

```tsx
<Floating>
  <FloatingElement depth={0.5}>
    <div className="absolute top-1/2 left-1/4 bg-red-500" />
  </FloatingElement>
  <FloatingElement depth={1}>
    <div className="absolute top-1/2 left-2/4 bg-green-500" />
  </FloatingElement>
  <FloatingElement depth={2}>
    <div className="absolute top-1/2 left-3/4 bg-blue-500" />
  </FloatingElement>
</Floating>
```

The advantage of this setup is that you can style and position your elements however you want using Tailwind classes or custom CSS directly on the `FloatingElement` component, while the `Floating` wrapper component handles all the complex animation logic. Simply wrap your positioned elements with `FloatingElement`, set their `depth` value, and the floating effect will be applied while maintaining your original styling and positioning.

## Understanding the component

If you're curious how it works, here's a quick overview of the component's internals:

1. **Element Registration**: Using React Context, each `FloatingElement` child registers itself with the parent `Floating` component, providing its DOM reference and depth value.

2. **Mouse Position Tracking**: The component tracks mouse movement across the screen using a custom hook that provides normalized coordinates relative to the container.

3. **Animation Loop**: Using Framer Motion's `useAnimationFrame`, the component runs a continuous animation loop that:

   - Calculates the target position for each element based on the mouse coordinates
   - Applies linear interpolation (lerp) to smoothly transition elements to their new positions
   - Updates the transform property of each element using CSS transforms

4. **Strength**: The floating effect is customized through two main factors:
   - Individual `depth` values on each `FloatingElement` determine how far that element moves. The higher the depth, the farther the element will move.
   - The global `sensitivity` prop controls the overall intensity of the movement
5. **Lerp**: The `easingFactor` prop determines how quickly elements move toward their target positions - lower values create smoother, more gradual movements while higher values create snappier responses.

## Notes

### Z-Index Management

The `Floating` component focuses solely on movement animation and does not handle z-index stacking. You'll need to manually set appropriate z-index values on your `FloatingElement` components to achieve the desired layering effect. The `depth` prop only controls the intensity of the floating movement, not the visual stacking order.

### Performance Optimization

For better performance when dealing with multiple floating elements, you can use a grouping strategy:

1. Instead of creating individual `FloatingElement` components for each item, group related items under a single `FloatingElement`
2. All children of a `FloatingElement` will move together with the same depth value
3. This reduces the number of elements being calculated and transformed

For example, if you have 6 floating images, instead of creating 6 separate `FloatingElement` components, you could group them into 3 pairs. This reduces the animation calculations from 6 to 3.

### Directional Control

With the `depth` and `sensitivity` props, you can control the direction, and strength of the floating effect:

- **Positive Values**: Elements move toward the mouse cursor

  - Higher values create stronger movement
  - Example: `depth={2}` moves twice as far as `depth={1}`

- **Negative Values**: Elements move away from the mouse cursor
  - Creates an inverse floating effect
  - Example: `depth={-1}` moves in the opposite direction of the mouse

## Credits

Ported to Framer by [Framer University](https://framer.university/)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed |
| sensitivity | `number` | `0.1` | The sensitivity of the movement |
| easingFactor | `number` | `0.05` | The easing factor of the movement |
| className | `string` | - | Additional CSS classes for styling |

### FloatingElement

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed |
| depth | `number` | `1` | The depth of the element |
| className | `string` | - | Additional CSS classes for styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/image/parallax-floating).*