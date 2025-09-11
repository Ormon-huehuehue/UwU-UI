# Elastic Line

> A wobbly svg line with a spring cursor interaction.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [use-mouse-position](#use-mouse-position)
    - [use-dimensions](#use-dimensions)
    - [use-elastic-line-events](#use-elastic-line-events)
    - [elastic-line](#elastic-line)
- [Understanding the component](#understanding-the-component)
- [Resources](#resources)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
"use client"

import { motion } from "motion/react"

import ElasticLine from "@/fancy/components/physics/elastic-line"

export default function Preview() {
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  }

  return (
    <div className="w-dvw h-dvh flex flex-row items-center justify-center font-overused-grotesk overflow-hidden bg-white text-foreground dark:text-muted">
      <div className="absolute left-0 top-0 w-full h-full px-6 sm:px-8 md:px-12 z-10">
        {/* Animated elastic line */}
        <ElasticLine
          releaseThreshold={50}
          strokeWidth={1}
          animateInTransition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.15,
          }}
        />
      </div>

      {/* This is just fluff for the demo */}
      <div className="h-full flex flex-col py-6 w-full px-6 sm:px-8 md:px-12 font-light">
        <div className="h-1/2 py-8 w-full items-end flex">
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="uppercase text-4xl sm:text-5xl md:text-6xl font-medium"
            custom={0}
          >
            UwU UI
          </motion.p>
        </div>
        <div className="flex flex-row  pt-8 justify-between items-start gap-x-4">
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="w-1/3 uppercase md:text-7xl hidden md:block text-orange-500"
            custom={0}
          >
            ✽
          </motion.p>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="w-full md:w-2/3 sm:text-left text-base sm:text-xl md:text-2xl"
            custom={1}
          >
            Ready to use, fancy, animated React components & microinteractions
            for creative developers.
          </motion.p>
        </div>

        {/* <div className="h-1/3 flex items-center justify-end">
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            
          </motion.p>
        </div> */}
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/elastic-line.json"
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

And a hook for querying the dimensions of an element:

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

For better readability, there is another hook for getting the elastic line's control point, and if the line is grabbed or not:

#### use-elastic-line-events

```tsx
import { useEffect, useState } from "react"

import { useDimensions } from "@/hooks/use-dimensions"
import { useMousePosition } from "@/hooks/use-mouse-position"

interface ElasticLineEvents {
  isGrabbed: boolean
  controlPoint: { x: number; y: number }
}

export function useElasticLineEvents(
  containerRef: React.RefObject<SVGSVGElement>,
  isVertical: boolean,
  grabThreshold: number,
  releaseThreshold: number
): ElasticLineEvents {
  const mousePosition = useMousePosition(containerRef)
  const dimensions = useDimensions(containerRef)
  const [isGrabbed, setIsGrabbed] = useState(false)
  const [controlPoint, setControlPoint] = useState({
    x: dimensions.width / 2,
    y: dimensions.height / 2,
  })

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = dimensions
      const x = mousePosition.x
      const y = mousePosition.y

      // Check if mouse is outside container bounds
      const isOutsideBounds = x < 0 || x > width || y < 0 || y > height

      if (isOutsideBounds) {
        setIsGrabbed(false)
        return
      }

      let distance: number
      let newControlPoint: { x: number; y: number }

      if (isVertical) {
        const midX = width / 2
        distance = Math.abs(x - midX)
        newControlPoint = {
          x: midX + 2.2 * (x - midX),
          y: y,
        }
      } else {
        const midY = height / 2
        distance = Math.abs(y - midY)
        newControlPoint = {
          x: x,
          y: midY + 2.2 * (y - midY),
        }
      }

      setControlPoint(newControlPoint)

      if (!isGrabbed && distance < grabThreshold) {
        setIsGrabbed(true)
      } else if (isGrabbed && distance > releaseThreshold) {
        setIsGrabbed(false)
      }
    }
  }, [mousePosition, isVertical, isGrabbed, grabThreshold, releaseThreshold])

  return { isGrabbed, controlPoint }
}

```

Then, copy and paste the component code into your project, and update your imports:

#### elastic-line

```tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  ValueAnimationTransition,
} from "motion/react"

import { useDimensions } from "@/hooks/use-dimensions"
import { useElasticLineEvents } from "@/hooks/use-elastic-line-events"

interface ElasticLineProps {
  isVertical?: boolean
  grabThreshold?: number
  releaseThreshold?: number
  strokeWidth?: number
  transition?: ValueAnimationTransition
  animateInTransition?: ValueAnimationTransition
  className?: string
}

const ElasticLine: React.FC<ElasticLineProps> = ({
  isVertical = false,
  grabThreshold = 5,
  releaseThreshold = 100,
  strokeWidth = 1,
  transition = {
    type: "spring",
    stiffness: 300,
    damping: 5,
  },
  animateInTransition = {
    duration: 0.3,
    ease: "easeInOut",
  },
  className,
}) => {
  const containerRef = useRef<SVGSVGElement>(null)
  const dimensions = useDimensions(containerRef)
  const pathRef = useRef<SVGPathElement>(null)
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false)

  // Clamp releaseThreshold to container dimensions
  const clampedReleaseThreshold = Math.min(
    releaseThreshold,
    isVertical ? dimensions.width / 2 : dimensions.height / 2
  )

  const { isGrabbed, controlPoint } = useElasticLineEvents(
    containerRef,
    isVertical,
    grabThreshold,
    clampedReleaseThreshold
  )

  const x = useMotionValue(dimensions.width / 2)
  const y = useMotionValue(dimensions.height / 2)
  const pathLength = useMotionValue(0)

  useEffect(() => {
    // Initial draw animation
    if (!hasAnimatedIn && dimensions.width > 0 && dimensions.height > 0) {
      animate(pathLength, 1, {
        ...animateInTransition,
        onComplete: () => setHasAnimatedIn(true),
      })
    }
    x.set(dimensions.width / 2)
    y.set(dimensions.height / 2)
  }, [dimensions, hasAnimatedIn])

  useEffect(() => {
    if (!isGrabbed && hasAnimatedIn) {
      animate(x, dimensions.width / 2, transition)
      animate(y, dimensions.height / 2, transition)
    }
  }, [isGrabbed])

  useAnimationFrame(() => {
    if (isGrabbed) {
      x.set(controlPoint.x)
      y.set(controlPoint.y)
    }

    const controlX = hasAnimatedIn ? x.get() : dimensions.width / 2
    const controlY = hasAnimatedIn ? y.get() : dimensions.height / 2

    pathRef.current?.setAttribute(
      "d",
      isVertical
        ? `M${dimensions.width / 2} 0Q${controlX} ${controlY} ${
            dimensions.width / 2
          } ${dimensions.height}`
        : `M0 ${dimensions.height / 2}Q${controlX} ${controlY} ${
            dimensions.width
          } ${dimensions.height / 2}`
    )
  })

  return (
    <svg
      ref={containerRef}
      className={`w-full h-full ${className}`}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="none"
    >
      <motion.path
        ref={pathRef}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        initial={{ pathLength: 0 }}
        style={{ pathLength }}
        fill="none"
      />
    </svg>
  )
}

export default ElasticLine

```

## Understanding the component

This component is made with a simple svg quadratic curve, with 2+1 points. The start and end points of the curve positioned at the two edges of the parent container, either horizontally or vertically, depending on the `isVertical` prop. This means, the line will always be centered in the container, and it will always fill up the entire container, so make sure to position your container properly.

The third point of the line is the control point, named `Q`, which is positioned at the center of the container by default. When the cursor moves close to the line (within `grabThreshold`), the control point will be controlled by the cursor's position. When the distance between them is greater than the `releaseThreshold` prop, the control point is animated back to the center of the container, with the help of motion's `animate` function.

For better readability — the calculation of the control point's position, and the signal it's grabbed — done in a separate hook, called `useElasticLineEvents`.

To achiave the elastic effect we use a springy transition by default, but feel free to experiment with other type of animations, easings, durations, etc.

The compoment also have an `animateInTransition` prop, which is used when the line is initially rendered. If you want to skip this, just set the transiton's `duration` to `0`.

## Resources

- [MDN Web Docs for SVG Quadratic Curve](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
- [Motion docs for SVG paths](https://www.framer.com/motion/component/#%23%23svg-line-drawing/)

## Credits

Ported to Framer by [Framer University](https://framer.university/)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| isVertical | `boolean` | `false` | Whether the line is vertical or horizontal |
| grabThreshold | `number` | `5` | The distance threshold for grabbing the line |
| releaseThreshold | `number` | `100` | The distance threshold for releasing the line |
| strokeWidth | `number` | `1` | The width of the line stroke |
| transition | `Transition` | `{ type: "spring", stiffness: 400, damping: 5, delay: 0 }` | The transition object of the line. Refer to motion docs for more details |
| animateInTransition | `Transition` | `{ type: "spring", stiffness: 400, damping: 5, delay: 0 }` | The transition object of the line when it is initially rendered. Refer to motion docs for more details |
| className | `string` | - | Additional CSS classes for styling on the svg container |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/physics/elastic-line).*