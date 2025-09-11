# Screensaver

> A component that animates its child with the infamous screensaver effect.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [use-dimensions](#use-dimensions)
    - [screensaver](#screensaver)
- [Usage](#usage)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
import React from "react"
import { exampleImages } from "@/utils/demo-images"

import Screensaver from "@/fancy/components/blocks/screensaver"

const CirclingElementsDemo: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      className="w-dvw h-dvh bg-[#efefef] overflow-hidden flex items-center justify-center relative text-foreground dark:text-muted"
      ref={containerRef}
    >
      <h1 className="z-30 text-3xl md:text-6xl font-overused-grotesk">
        page not found
      </h1>
      {[...exampleImages, ...exampleImages].map((image, index) => (
        <Screensaver
          key={index}
          speed={1}
          startPosition={{ x: index * 3, y: index * 3 }}
          startAngle={40}
          containerRef={containerRef}
        >
          <div className="w-20 h-20 md:w-48 md:h-48 overflow-hidden">
            <img
              src={image.url}
              alt={`Example ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </Screensaver>
      ))}
    </div>
  )
}

export default CirclingElementsDemo

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/screensaver.json"
```

### Manual

#### use-dimensions

```tsx
import { RefObject, useEffect, useState } from "react"

interface Dimensions {
  width: number
  height: number
}

export function useDimensions(
  ref: RefObject<HTMLElement | SVGElement>
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [ref])

  return dimensions
}

```

#### screensaver

```tsx
"use client"

import React, { useEffect, useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"

type ScreensaverProps = {
  children: React.ReactNode
  containerRef: React.RefObject<HTMLElement>
  speed?: number
  startPosition?: { x: number; y: number } // x,y as percentages (0-100)
  startAngle?: number // in degrees
  className?: string
}

const Screensaver: React.FC<ScreensaverProps> = ({
  children,
  speed = 3,
  startPosition = { x: 0, y: 0 },
  startAngle = 45,
  containerRef,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const angle = useRef((startAngle * Math.PI) / 180)

  const containerDimensions = useDimensions(containerRef)
  const elementDimensions = useDimensions(elementRef)

  // Set initial position based on container dimensions and percentage
  useEffect(() => {
    if (containerDimensions.width && containerDimensions.height) {
      const initialX =
        (startPosition.x / 100) *
        (containerDimensions.width - (elementDimensions.width || 0))
      const initialY =
        (startPosition.y / 100) *
        (containerDimensions.height - (elementDimensions.height || 0))
      x.set(initialX)
      y.set(initialY)
    }
  }, [containerDimensions, elementDimensions, startPosition])

  useAnimationFrame(() => {
    const velocity = speed
    const dx = Math.cos(angle.current) * velocity
    const dy = Math.sin(angle.current) * velocity

    let newX = x.get() + dx
    let newY = y.get() + dy

    // Check for collisions with container boundaries
    if (
      newX <= 0 ||
      newX + elementDimensions.width >= containerDimensions.width
    ) {
      angle.current = Math.PI - angle.current
      newX = Math.max(
        0,
        Math.min(newX, containerDimensions.width - elementDimensions.width)
      )
    }
    if (
      newY <= 0 ||
      newY + elementDimensions.height >= containerDimensions.height
    ) {
      angle.current = -angle.current
      newY = Math.max(
        0,
        Math.min(newY, containerDimensions.height - elementDimensions.height)
      )
    }

    x.set(newX)
    y.set(newY)
  })

  return (
    <motion.div
      ref={elementRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x,
        y,
      }}
      className={cn("transform will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}

export default Screensaver

```

## Usage

Just wrap your content with the component, and the animation will take care of the rest.
You also need to pass a container ref to the component — which will be used to constrain the screensaver component.

## Credits

Ported to Framer by [Achille Ernoult](https://x.com/achilleernlt)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed |
| containerRef* | `React.RefObject` | - | Reference to the container for the screensaver |
| speed | `number` | `3` | Speed of the animation in pixels per second |
| startPosition | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Starting position of the element |
| startAngle | `number` | `45` | Starting angle of the element in degrees |
| className | `string` | - | Additional CSS classes for styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/screensaver).*