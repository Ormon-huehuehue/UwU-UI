# Simple Marquee

> A simple marquee component for scrolling HTML elements.

## Table of Contents

- [Credits](#credits)
- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [simple-marquee](#simple-marquee)
- [Usage](#usage)
- [Understanding the component](#understanding-the-component)
  - [Core Animation](#core-animation)
  - [Motion values](#motion-values)
  - [Base velocity](#base-velocity)
  - [Animation frame](#animation-frame)
  - [Transformation](#transformation)
  - [Wrapping](#wrapping)
  - [Preventing "Jumps" With Repetition](#preventing-jumps-with-repetition)
  - [Repeat example](#repeat-example)
- [Features](#features)
  - [Slow Down On Hover](#slow-down-on-hover)
  - [Slow down on hover](#slow-down-on-hover)
  - [Scroll-Based Velocity](#scroll-based-velocity)
  - [Scroll velocity](#scroll-velocity)
  - [Custom Easing Functions](#custom-easing-functions)
  - [Custom easing](#custom-easing)
  - [Draggable Marquee](#draggable-marquee)
  - [Dragging](#dragging)
  - [Drag animation frame](#drag-animation-frame)
  - [Drag velocity decay](#drag-velocity-decay)
  - [Drag direction](#drag-direction)
- [3D Transforms](#3d-transforms)
  - [3D transforms](#3d-transforms)
- [Resources](#resources)
- [Props](#props)

Example:

```tsx
import React, { useState } from "react"

import SimpleMarquee from "@/fancy/components/blocks/simple-marquee"

const exampleImages = [
  "https://cdn.cosmos.so/4b771c5c-d1eb-4948-b839-255dbeb931ba?format=jpeg",
  "https://cdn.cosmos.so/a8d82afd-2293-43ad-bac3-887683d85b44?format=jpeg",
  "https://cdn.cosmos.so/49206ba5-c174-4cd5-aee8-5b744842e6c2?format=jpeg",
  "https://cdn.cosmos.so/b29bd150-6477-420f-8efb-65ed99694421?format=jpeg",
  "https://cdn.cosmos.so/e1a0313e-7617-431d-b7f1-f1b169e6bcb4?format=jpeg",
  "https://cdn.cosmos.so/ad640c12-69fb-4186-bc3d-b1cc93986a37?format=jpeg",
  "https://cdn.cosmos.so/5cf0c3d2-e785-41a3-b0c8-a073ee2f2862?format=jpeg",
  "https://cdn.cosmos.so/938ab21c-a975-41b3-b303-418290343b09?format=jpeg",
  "https://cdn.cosmos.so/2e14a9bb-27e3-40fd-b940-cfb797a1224c?format=jpeg",
  "https://cdn.cosmos.so/81841d9f-e164-4770-aebc-cfc97d72f3ab?format=jpeg",
  "https://cdn.cosmos.so/49b81db0-37ea-4569-b0d6-04afa5115a10?format=jpeg",
  "https://cdn.cosmos.so/ade1834b-9317-44fb-8dc3-b43d29acd409?format=jpeg",
  "https://cdn.cosmos.so/621c250c-3833-45f9-862a-3f400aaf8f28?format=jpeg",
  "https://cdn.cosmos.so/f9b7eae8-e5a6-4ce6-b6e1-9ef125ba7f8e?format=jpeg",
  "https://cdn.cosmos.so/bd56ed6d-1bbd-44a4-b1a1-79b7199bbebb?format=jpeg",
]

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-2 sm:mx-3 md:mx-4 hover:scale-105 cursor-pointer duration-300 ease-in-out">
    {children}
  </div>
)

export default function SimpleMarqueeDemo() {
  const firstThird = exampleImages.slice(
    0,
    Math.floor(exampleImages.length / 3)
  )
  const secondThird = exampleImages.slice(
    Math.floor(exampleImages.length / 3),
    Math.floor((2 * exampleImages.length) / 3)
  )
  const lastThird = exampleImages.slice(
    Math.floor((2 * exampleImages.length) / 3)
  )

  const [container, setContainer] = useState<HTMLElement | null>(null)

  return (
    <div
      className="flex w-dvw h-dvh relative justify-center items-center flex-col bg-black overflow-auto"
      ref={(node) => setContainer(node)}
    >
      <h1 className="absolute text-center text-3xl sm:text-5xl md:text-6xl top-1/3 sm:top-1/3 md:top-1/4 text-white font-calendas">
        Weekly Finds
      </h1>
      <div className="absolute h-[170%] sm:h-[200%] top-0 w-full justify-center items-center flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
        <SimpleMarquee
          className="w-full"
          baseVelocity={8}
          repeat={4}
          draggable={false}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowDownFactor={0.1}
          slowdownOnHover
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          scrollAwareDirection={true}
          scrollContainer={{ current: container }}
          useScrollVelocity={true}
          direction="left"
        >
          {firstThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full"
          baseVelocity={8}
          repeat={4}
          scrollAwareDirection={true}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowdownOnHover
          slowDownFactor={0.1}
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          useScrollVelocity={true}
          scrollContainer={{ current: container }}
          draggable={false}
          direction="right"
        >
          {secondThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={src}
                alt={`Image ${i + firstThird.length}`}
                className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full"
          baseVelocity={8}
          repeat={4}
          draggable={false}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          slowDownFactor={0.1}
          slowdownOnHover
          slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
          scrollAwareDirection={true}
          scrollContainer={{ current: container }}
          useScrollVelocity={true}
          direction="left"
        >
          {lastThird.map((src, i) => (
            <MarqueeItem key={i}>
              <img
                src={src}
                alt={`Image ${i + firstThird.length + secondThird.length}`}
                className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>
      </div>
    </div>
  )
}

```

Artworks from [Cosmos](https://www.cosmos.so/danielpetho/gradients/).

## Credits

This component is inspired by [this scroll example](https://codesandbox.io/p/sandbox/framer-motion-scroll-velocity-r1dy4u?from-embed) by Motion. 

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/simple-marquee.json"
```

### Manual

#### simple-marquee

```tsx
import { RefObject, useRef } from "react"
import {
  motion,
  SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"

import { cn } from "@/lib/utils"

// Custom wrap function
const wrap = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

interface SimpleMarqueeProps {
  children: React.ReactNode // The elements to be scrolled
  className?: string // Additional CSS classes for the container
  direction?: "left" | "right" | "up" | "down" // The direction of the marquee
  baseVelocity?: number // The base velocity of the marquee in pixels per second
  easing?: (value: number) => number // The easing function for the animation
  slowdownOnHover?: boolean // Whether to slow down the animation on hover
  slowDownFactor?: number // The factor to slow down the animation on hover
  slowDownSpringConfig?: SpringOptions // The spring config for the slow down animation
  useScrollVelocity?: boolean // Whether to use the scroll velocity to control the marquee speed
  scrollAwareDirection?: boolean // Whether to adjust the direction based on the scroll direction
  scrollSpringConfig?: SpringOptions // The spring config for the scroll velocity-based direction adjustment
  scrollContainer?: RefObject<HTMLElement> | HTMLElement | null // The container to use for the scroll velocity
  repeat?: number // The number of times to repeat the children.
  draggable?: boolean // Whether to allow dragging of the marquee
  dragSensitivity?: number // The sensitivity of the drag movement
  dragVelocityDecay?: number // The decay of the drag velocity. This means how fast the velocity will gradually reduce to baseVelocity when we release the drag
  dragAwareDirection?: boolean // Whether to adjust the direction based on the drag velocity
  dragAngle?: number // The angle of the drag movement in degrees. This is useful if you eg. rotating your marquee by 45 degrees
  grabCursor?: boolean // Whether to change the cursor to grabbing when dragging
}

const SimpleMarquee = ({
  children,
  className,
  direction = "right",
  baseVelocity = 5,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  dragAngle = 0,
  grabCursor = false,
  easing,
}: SimpleMarqueeProps) => {
  const innerContainer = useRef<HTMLDivElement>(null)
  const baseX = useMotionValue(0)
  const baseY = useMotionValue(0)

  const { scrollY } = useScroll({
    container:
      (scrollContainer as RefObject<HTMLDivElement>) || innerContainer.current,
  })

  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig)

  const hoverFactorValue = useMotionValue(1)
  const defaultVelocity = useMotionValue(1)

  // Track if user is currently dragging
  const isDragging = useRef(false)

  // Store drag velocity
  const dragVelocity = useRef(0)

  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)

  // Transform scroll velocity into a factor that affects marquee speed
  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    {
      clamp: false,
    }
  )

  // Determine if movement is horizontal or vertical.
  const isHorizontal = direction === "left" || direction === "right"

  // Convert baseVelocity to the correct direction
  const actualBaseVelocity =
    direction === "left" || direction === "up" ? -baseVelocity : baseVelocity

  // Reference to track if mouse is hovering
  const isHovered = useRef(false)

  // Direction factor for changing direction based on scroll or drag
  const directionFactor = useRef(1)

  // Transform baseX/baseY into a percentage for the transform
  // The wrap function ensures the value stays between 0 and -100
  const x = useTransform(baseX, (v) => {
    // Apply easing if provided, otherwise use linear (v directly)
    const wrappedValue = wrap(0, -100, v)
    return `${easing ? easing(wrappedValue / -100) * -100 : wrappedValue}%`
  })
  const y = useTransform(baseY, (v) => {
    // Apply easing if provided, otherwise use linear (v directly)
    const wrappedValue = wrap(0, -100, v)
    return `${easing ? easing(wrappedValue / -100) * -100 : wrappedValue}%`
  })

  useAnimationFrame((t, delta) => {
    if (isDragging.current && draggable) {
      if (isHorizontal) {
        baseX.set(baseX.get() + dragVelocity.current)
      } else {
        baseY.set(baseY.get() + dragVelocity.current)
      }

      // Add decay to dragVelocity when not moving
      // This will gradually reduce the velocity to zero when the pointer isn't moving
      dragVelocity.current *= 0.9

      // Stop completely if velocity is very small
      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0
      }

      return
    }

    // Update hover factor
    if (isHovered.current) {
      hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1)
    } else {
      hoverFactorValue.set(1)
    }

    // Calculate regular movement
    let moveBy =
      directionFactor.current *
      actualBaseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get()

    // Adjust movement based on scroll velocity if scrollAwareDirection is enabled
    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    if (draggable) {
      moveBy += dragVelocity.current

      // Update direction based on drag direction if dragAwareDirection is true
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        // If dragging in negative direction, set directionFactor to -1
        // If dragging in positive direction, set directionFactor to 1
        directionFactor.current = Math.sign(dragVelocity.current)
      }

      // Gradually decay drag velocity back to zero
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay
      } else if (!isDragging.current) {
        dragVelocity.current = 0
      }
    }

    if (isHorizontal) {
      baseX.set(baseX.get() + moveBy)
    } else {
      baseY.set(baseY.get() + moveBy)
    }
  })

  const lastPointerPosition = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable)
      return // Capture the pointer to receive events even when pointer moves outside
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

    if (grabCursor) {
      ;(e.currentTarget as HTMLElement).style.cursor = "grabbing"
    }

    isDragging.current = true
    lastPointerPosition.current = { x: e.clientX, y: e.clientY }

    // Pause automatic animation by setting velocity to 0
    dragVelocity.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return

    const currentPosition = { x: e.clientX, y: e.clientY }

    // Calculate delta from last position
    const deltaX = currentPosition.x - lastPointerPosition.current.x
    const deltaY = currentPosition.y - lastPointerPosition.current.y

    // Convert dragAngle from degrees to radians
    const angleInRadians = (dragAngle * Math.PI) / 180

    // Calculate the projection of the movement along the angle direction
    // Using the dot product of the movement vector and the direction vector
    const directionX = Math.cos(angleInRadians)
    const directionY = Math.sin(angleInRadians)

    // Project the movement onto the angle direction
    const projectedDelta = deltaX * directionX + deltaY * directionY

    // Update drag velocity based on the projected movement
    dragVelocity.current = projectedDelta * dragSensitivity

    // Update last position
    lastPointerPosition.current = currentPosition
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return // Release pointer capture
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)

    isDragging.current = false
  }

  return (
    <motion.div
      className={cn("flex", isHorizontal ? "flex-row" : "flex-col", className)}
      onHoverStart={() => (isHovered.current = true)}
      onHoverEnd={() => (isHovered.current = false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      ref={innerContainer}
    >
      {Array.from({ length: repeat }, (_, i) => i).map((i) => (
        <motion.div
          key={i}
          className={cn(
            "shrink-0",
            isHorizontal && "flex",
            draggable && grabCursor && "cursor-grab"
          )}
          style={isHorizontal ? { x } : { y }}
          aria-hidden={i > 0}
        >
          {children}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default SimpleMarquee

```

## Usage

You only need to wrap your elements with the `SimpleMarquee` component, everything else is taken care of by the component itself.

## Understanding the component

Unlike most marquee implementations that use simple CSS animations, this component uses Motion's `useAnimationFrame` hook to provide more control over the animation. This allows for a bunch of fancy effects, such as:

- Changing velocity and direction by dragging
- Adjusting speed in response to scrolling
- Adding custom easing functions
- Creating pause/slow on hover effects

### Core Animation

The main magic of this component is the `useAnimationFrame` hook from Motion, which executes our anim code on every frame. Here's how it works:

1. We create motion values (using `useMotionValue`) to track the x or y position:

### Motion values

```tsx
const baseX = useMotionValue(0)
const baseY = useMotionValue(0)
```

2. We define a `baseVelocity` prop that determines the default speed and direction:

### Base velocity

```tsx
  // Convert baseVelocity to the correct direction
  const actualBaseVelocity =
    direction === "left" || direction === "up" ? -baseVelocity : baseVelocity
```

3. On each animation frame inside the `useAnimationFrame` hook, we increment the position values, by adding that velocity to the current position:

### Animation frame

```tsx
// Inside useAnimationFrame
let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

if (isHorizontal) {
  baseX.set(baseX.get() + moveBy)
} else {
  baseY.set(baseY.get() + moveBy)
}
```

4. Since we're constantly increasing/decreasing that value, at some point our elements would move out far away from the viewport. Therefore, we use the `useTransform` hook to convert that x/y value to a percentage, and wrapping it between 0 and -100. With this, we essentially force our elements to always move from 0 to -100. Once they reach -100, they will start their journey from 0% again.

### Transformation

```tsx
const x = useTransform(baseX, (v) => {
  // wrap it between 0 and -100
  const wrappedValue = wrap(0, -100, v)
  // Apply easing if provided, otherwise use linear
  return `${easing ? easing(wrappedValue / -100) * -100 : wrappedValue}%`
})
```

5. The `wrap` helper function ensures values stay between 0 and -100:

### Wrapping

```tsx
const wrap = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}
```

This example demonstrates the basic mechanism:

Example:

```tsx
import { useState } from "react"

import { Button } from "@/components/ui/button"
import SimpleMarquee from "@/fancy/components/blocks/simple-marquee"

const MarqueeItem = ({ index }: { index: number }) => (
  <div className="bg-zinc-950 text-white w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-4 sm:mx-6 md:mx-8 relative rounded-xl shadow  shadow-white">
    <span className="absolute top-2 left-3 sm:left-3 md:left-4 text-base sm:text-lg md:text-lg">
      ITEM {index.toString().padStart(2, "0")}
    </span>
    <span className="absolute bottom-2 left-3 sm:left-3 md:left-4 text-sm sm:text-base md:text-base opacity-70">
      fancy
    </span>
  </div>
)

export default function SimpleMarqueeExplainerDemo() {
  const [repeat, setRepeat] = useState(1)

  return (
    <div className="w-dvw h-dvh relative flex justify-center items-center bg-black">
      <Button
        variant={"outline"}
        size={"sm"}
        className="absolute top-4 left-4 h-8"
        onClick={() => setRepeat((prev) => (prev < 5 ? prev + 1 : 1))}
      >
        Repeat: {repeat}
      </Button>

      <div className="sm:m-6 md:m-8 border border-border p-4 flex justify-center items-center w-[200px] sm:w-[450px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[400px]">
        <SimpleMarquee baseVelocity={30} repeat={repeat} direction="left">
          <MarqueeItem index={1} />
          <MarqueeItem index={2} />
        </SimpleMarquee>
      </div>
    </div>
  )
}

```

### Preventing "Jumps" With Repetition

As you can see above, elements eventually leave the container and jump back to the beginning when they reach -100%. This creates a visible "jump" in the animation.

We can solve this by using the `repeat` prop to duplicate all child elements multiple times inside the component:

### Repeat example

```tsx
{
  Array.from({ length: repeat }, (_, i) => i).map((i) => (
    <motion.div
      key={i}
      className={cn(
        "shrink-0",
        isHorizontal && "flex",
        draggable && grabCursor && "cursor-grab"
      )}
      style={isHorizontal ? { x } : { y }}
      aria-hidden={i > 0}
    >
      {children}
    </motion.div>
  ))
}
```

By default, the `repeat` value is 3, which means your content is duplicated three times. With enough repetitions, new elements enter the visible area before existing ones leave, creating an illusion of continuous animation. Try increasing the `repeat` value in the demo above to see how it eliminates the jumpiness.

## Features

The marquee's final velocity and behavior are determined by combining several factors that can be enabled through props:

### Slow Down On Hover

When `slowdownOnHover` is set to `true`, the component tracks hover state and applies a slowdown factor:

### Slow down on hover

```tsx
// Track hover state
const isHovered = useRef(false)
const hoverFactorValue = useMotionValue(1)
const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)

// In component JSX
<motion.div
  onHoverStart={() => (isHovered.current = true)}
  onHoverEnd={() => (isHovered.current = false)}
  // ...other props
>
  {/* ... */}
</motion.div>

// In animation frame
if (isHovered.current) {
  hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1)
} else {
  hoverFactorValue.set(1)
}

// Apply the hover factor to movement calculation
let moveBy = directionFactor.current *
             actualBaseVelocity *
             (delta / 1000) *
             smoothHoverFactor.get()
```

Key props for this feature:

- `slowDownFactor` controls how much to slow down (default: 0.3 or 30% of original speed)
- `smoothHoverFactor` uses spring physics for smooth transitions between speeds. This ensures that the velocity change is not happening instantly, but with a smooth animation. For this, we use the `useSpring` hook from Motion. 
- `slowDownSpringConfig` lets you customize the spring animation parameters. Please refer to the [Motion documentation](https://motion.dev/docs/react-use-spring) for more details.

### Scroll-Based Velocity

When `useScrollVelocity` is enabled, the component tracks scroll velocity and uses it to influence the final velocity of the marquee:

### Scroll velocity

```tsx
const { scrollY } = useScroll({
  container: (scrollContainer as RefObject<HTMLDivElement>) || innerContainer.current,
})
const scrollVelocity = useVelocity(scrollY)
const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig)

// Transform scroll velocity into a factor for marquee speed
const velocityFactor = useTransform(
  useScrollVelocity ? smoothVelocity : defaultVelocity,
  [0, 1000],
  [0, 5],
  { clamp: false }
)

// In animation frame
// Adjust movement based on scroll velocity
moveBy += directionFactor.current * moveBy * velocityFactor.get()

// Change direction based on scroll if enabled
if (scrollAwareDirection && !isDragging.current) {
  if (velocityFactor.get() < 0) {
    directionFactor.current = -1
  } else if (velocityFactor.get() > 0) {
    directionFactor.current = 1
  }
}
```

This creates an interactive effect where:

- Scrolling adds to the marquee's velocity
- If `scrollAwareDirection` is enabled, the scroll direction can reverse the marquee direction
- Similar to the hover, we interpolate between the current and scroll velocity by using Spring physics with the `useSpring` hook from Motion. You can customize the spring animation parameters using the `scrollSpringConfig` prop.

### Custom Easing Functions

The `easing` prop allows you to transform the linear animation with custom easing curves:

### Custom easing

```tsx
const x = useTransform(baseX, (v) => {
  // Apply easing if provided, otherwise use linear
  const wrappedValue = wrap(0, -100, v)
  return `${easing ? easing(wrappedValue / -100) * -100 : wrappedValue}%`
})
```

The easing function receives a normalized value between 0 and 1 and should return a transformed value. You need to provide an actual function here, not defined keyframes.

You can find ready-to-use easing functions at [easings.net](https://easings.net/).

Example:

```tsx
import React, { useRef } from "react"

import SimpleMarquee from "@/fancy/components/blocks/simple-marquee"

const exampleImages = [
  "https://cdn.cosmos.so/4b771c5c-d1eb-4948-b839-255dbeb931ba?format=jpeg",
  "https://cdn.cosmos.so/a8d82afd-2293-43ad-bac3-887683d85b44?format=jpeg",
  "https://cdn.cosmos.so/49206ba5-c174-4cd5-aee8-5b744842e6c2?format=jpeg",
  "https://cdn.cosmos.so/b29bd150-6477-420f-8efb-65ed99694421?format=jpeg",
  "https://cdn.cosmos.so/e1a0313e-7617-431d-b7f1-f1b169e6bcb4?format=jpeg",
  "https://cdn.cosmos.so/ad640c12-69fb-4186-bc3d-b1cc93986a37?format=jpeg",
  "https://cdn.cosmos.so/5cf0c3d2-e785-41a3-b0c8-a073ee2f2862?format=jpeg",
  "https://cdn.cosmos.so/938ab21c-a975-41b3-b303-418290343b09?format=jpeg",
  "https://cdn.cosmos.so/2e14a9bb-27e3-40fd-b940-cfb797a1224c?format=jpeg",
  "https://cdn.cosmos.so/81841d9f-e164-4770-aebc-cfc97d72f3ab?format=jpeg",
  "https://cdn.cosmos.so/49b81db0-37ea-4569-b0d6-04afa5115a10?format=jpeg",
  "https://cdn.cosmos.so/ade1834b-9317-44fb-8dc3-b43d29acd409?format=jpeg",
  "https://cdn.cosmos.so/621c250c-3833-45f9-862a-3f400aaf8f28?format=jpeg",
  "https://cdn.cosmos.so/f9b7eae8-e5a6-4ce6-b6e1-9ef125ba7f8e?format=jpeg",
  "https://cdn.cosmos.so/bd56ed6d-1bbd-44a4-b1a1-79b7199bbebb?format=jpeg",
]

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 hover:scale-105 cursor-pointer duration-300 ease-in-out rounded overflow-hidden">
    {children}
  </div>
)

export default function SimpleMarqueeDemo() {
  const firstThird = exampleImages.slice(
    0,
    Math.floor(exampleImages.length / 3)
  )
  const secondThird = exampleImages.slice(
    Math.floor(exampleImages.length / 3),
    Math.floor((2 * exampleImages.length) / 3)
  )
  const lastThird = exampleImages.slice(
    Math.floor((2 * exampleImages.length) / 3)
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const easeFn = (x: number) => {
    return x === 0
      ? 0
      : x === 1
        ? 1
        : x < 0.5
          ? Math.pow(2, 20 * x - 10) / 2
          : (2 - Math.pow(2, -20 * x + 10)) / 2
  }

  return (
    <div
      className="flex w-dvw h-dvh relative justify-center items-center flex-col bg-black"
      ref={containerRef}
    >
      <div className="h-full top-0 w-full flex flex-row items-start">
        {/* Just fluff for the demo */}
        <div className="hidden sm:flex w-2/4 px-8 md:px-16 h-full items-center justify-center flex-col space-y-6 md:space-y-8 order-2">
          <h1 className="text-white font-calendas text-3xl md:text-4xl tracking-tight">
            Welcome Back!
          </h1>

          <div className="space-y-3 md:space-y-4 w-full max-w-[320px] md:max-w-[360px]">
            <div className="space-y-1">
              <input
                type="email"
                className="w-full bg-transparent border border-white rounded px-3.5 md:px-4 py-2 text-base md:text-lg text-white font-overusedGrotesk focus:outline-none focus:border-white"
                placeholder="Email"
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                className="w-full bg-transparent border border-white rounded px-3.5 md:px-4 py-2 text-base md:text-lg text-white font-overusedGrotesk focus:outline-none focus:border-white"
                placeholder="Password"
              />
            </div>

            <button className="w-full bg-white text-black font-overusedGrotesk font-medium py-2 text-base md:text-lg rounded hover:bg-neutral-200 transition-colors">
              Sign In
            </button>

            <p className="text-neutral-400 text-sm md:text-base text-center">
              Don't have an account?{" "}
              <a href="#" className="text-white hover:text-neutral-200">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Marquee section - this is the main content */}
        <div className="w-full sm:w-2/4 h-full flex flex-row space-x-2 sm:space-x-3 md:space-x-4 px-2 sm:px-3 md:px-4 justify-center sm:justify-end items-center sm:-mt-8 md:-mt-10 order-1">
          <SimpleMarquee
            className="h-full"
            baseVelocity={25}
            repeat={4}
            easing={easeFn}
            direction="up"
          >
            {firstThird.map((src, i) => (
              <MarqueeItem key={i}>
                <img
                  src={src}
                  alt={`Image ${i + 1}`}
                  draggable={false}
                  className="w-24 sm:w-28 md:w-32 object-cover"
                />
              </MarqueeItem>
            ))}
          </SimpleMarquee>

          <SimpleMarquee
            className="h-full"
            baseVelocity={25}
            repeat={4}
            easing={easeFn}
            direction="down"
          >
            {secondThird.map((src, i) => (
              <MarqueeItem key={i}>
                <img
                  src={src}
                  draggable={false}
                  alt={`Image ${i + firstThird.length}`}
                  className="w-24 sm:w-28 md:w-32 object-cover"
                />
              </MarqueeItem>
            ))}
          </SimpleMarquee>

          <SimpleMarquee
            className="h-full"
            baseVelocity={25}
            repeat={4}
            easing={easeFn}
            direction="up"
          >
            {lastThird.map((src, i) => (
              <MarqueeItem key={i}>
                <img
                  src={src}
                  draggable={false}
                  alt={`Image ${i + firstThird.length + secondThird.length}`}
                  className="w-24 sm:w-28 md:w-32 object-cover"
                />
              </MarqueeItem>
            ))}
          </SimpleMarquee>
        </div>
      </div>
    </div>
  )
}

```

### Draggable Marquee

The marquee can also be dragged. It uses pointer events for tracking the cursor position and applying the drag velocity:

### Dragging

```tsx
// State for tracking dragging
const isDragging = useRef(false)
const dragVelocity = useRef(0)
const lastPointerPosition = useRef({ x: 0, y: 0 })

const handlePointerDown = (e: React.PointerEvent) => {
  if (!draggable) return
  // Capture pointer events
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

  if (grabCursor) {
    (e.currentTarget as HTMLElement).style.cursor = "grabbing"
  }

  isDragging.current = true
  lastPointerPosition.current = { x: e.clientX, y: e.clientY }

  // Pause automatic animation
  dragVelocity.current = 0
}

const handlePointerMove = (e: React.PointerEvent) => {
  if (!draggable || !isDragging.current) return

  const currentPosition = { x: e.clientX, y: e.clientY }

  // Calculate movement delta
  const deltaX = currentPosition.x - lastPointerPosition.current.x
  const deltaY = currentPosition.y - lastPointerPosition.current.y

  // Support for angled dragging
  const angleInRadians = (dragAngle * Math.PI) / 180
  const directionX = Math.cos(angleInRadians)
  const directionY = Math.sin(angleInRadians)

  // Project movement along angle direction
  const projectedDelta = deltaX * directionX + deltaY * directionY

  // Set drag velocity
  dragVelocity.current = projectedDelta * dragSensitivity

  lastPointerPosition.current = currentPosition
}
```

During animation frames, dragging takes precedence over other movement factors. Meaning, when the user is dragging, the marquee will move according to the drag velocity, and we ignore all other factors (such as the hover, scroll and the basic velocity).

### Drag animation frame

```tsx
// Inside useAnimationFrame
if (isDragging.current && draggable) {
  if (isHorizontal) {
    baseX.set(baseX.get() + dragVelocity.current)
  } else {
    baseY.set(baseY.get() + dragVelocity.current)
  }

  // Add decay to dragVelocity when not moving
  dragVelocity.current *= 0.9

  // Stop completely if velocity is very small
  if (Math.abs(dragVelocity.current) < 0.01) {
    dragVelocity.current = 0
  }

  return
}
```

When the user stops dragging, velocity gradually decays back to the base velocity. You can customize the decay factor using the `dragVelocityDecay` prop.

### Drag velocity decay

```tsx
// Gradually decay drag velocity back to zero
if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
  dragVelocity.current *= dragVelocityDecay
} else if (!isDragging.current) {
  dragVelocity.current = 0
}
```

The component also supports changing direction based on drag movement:

### Drag direction

```tsx
// Update direction based on drag direction
if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
  // If dragging in negative direction, set directionFactor to -1
  // If dragging in positive direction, set directionFactor to 1
  directionFactor.current = Math.sign(dragVelocity.current)
}
```

Example:

```tsx
import React, { useState } from "react"
import { motion } from "motion/react"

import SimpleMarquee from "@/fancy/components/blocks/simple-marquee"
import VerticalCutReveal from "@/fancy/components/text/vertical-cut-reveal"

const imgs = [
  "https://cdn.cosmos.so/97fd931c-28cc-480f-91a8-cffb635cf832?format=jpeg",
  "https://cdn.cosmos.so/305a25f2-cc53-4ff3-95a5-6a5ca1517ff8?format=jpeg",
  "https://cdn.cosmos.so/2a024234-6713-41b2-a2f2-1d5e385ac490?format=jpeg",
  "https://cdn.cosmos.so/89cc65c1-b0bf-42f6-9afc-4db6678ae652?format=jpeg",
  "https://cdn.cosmos.so/211e0ca7-4126-4222-9de8-03aeb1e4688e?format=jpeg",
  "https://cdn.cosmos.so/b7dc0ec1-4b03-42ce-9805-1964d0f49feb?format=jpeg",
  "https://cdn.cosmos.so/43be3f32-bd6e-4fd1-93c8-d54e0d8196ee?format=jpeg",
  "https://cdn.cosmos.so/d0d146aa-b49c-48be-8b09-6b7eaf8e836d?format=jpeg",
  "https://cdn.cosmos.so/e765d51f-8be7-4618-83e2-90c13379b366?format=jpeg",
  "https://cdn.cosmos.so/c1854fe0-e974-4cb6-8bc4-ffcf1686b9e7?format=jpeg",
]

const firstRow = imgs.slice(0, 5)
const secondRow = imgs.slice(5)

const MarqueeItem = ({
  children,
  index,
}: {
  children: React.ReactNode
  index: number
}) => (
  <motion.div
    className="mx-2 sm:mx-3 md:mx-4 border-neutral-600 p-2 sm:p-3 md:p-4 shadow shadow-white/20 flex justify-center items-center flex-col perspective-near transform-3d rotate-y-45 rotate-z-12 bg-black"
    initial={{ opacity: 0, y: 0, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 + 0.1 * index }}
    style={{
      transform: `translateZ(-150px) rotate(${index * 15}deg)`,
      transformStyle: "preserve-3d",
    }}
  >
    {children}
  </motion.div>
)

export default function SimpleMarqueeDemo() {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  return (
    <div
      className="flex w-dvw h-dvh relative justify-center items-center flex-col bg-black overflow-y-auto overflow-x-hidden"
      ref={(node) => setContainer(node)}
    >
      <h1 className="absolute text-center text-3xl sm:text-5xl md:text-6xl top-32 sm:top-1/4 text-white font-calendas">
        <VerticalCutReveal splitBy="characters" staggerDuration={0.04}>
          New Arrivals
        </VerticalCutReveal>
      </h1>
      <div className="absolute h-full top-1/5 sm:top-2/4 w-full justify-center items-center flex flex-col space-y-2 sm:space-y-3 md:space-y-4 z-0">
        <SimpleMarquee
          className="w-full z-10 relative"
          baseVelocity={8}
          repeat={2}
          draggable={true}
          dragSensitivity={0.08}
          useScrollVelocity={true}
          scrollAwareDirection={true}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          scrollContainer={{ current: container }}
          dragAwareDirection={true}
          grabCursor
          direction="left"
        >
          {firstRow.map((src, i) => (
            <MarqueeItem key={i} index={i}>
              <motion.img
                src={src}
                alt={`Image ${i + 1}`}
                draggable={false}
                className="w-32 sm:w-36 md:w-44 select-none"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          className="w-full z-[100] relative"
          baseVelocity={8}
          repeat={2}
          draggable={true}
          dragSensitivity={0.08}
          useScrollVelocity={true}
          scrollAwareDirection={true}
          scrollSpringConfig={{ damping: 50, stiffness: 400 }}
          scrollContainer={{ current: container }}
          dragAwareDirection={true}
          grabCursor
          direction="right"
        >
          {secondRow.map((src, i) => (
            <MarqueeItem key={i} index={i}>
              <motion.img
                src={src}
                alt={`Image ${i + 6}`}
                draggable={false}
                className="w-32 sm:w-36 md:w-44 select-none"
              />
            </MarqueeItem>
          ))}
        </SimpleMarquee>
      </div>
    </div>
  )
}

```

Artwork credits: Artworks are from [Cosmos](https://cosmos.so/). I couldn't track down the original artists.

## 3D Transforms

To make a 3d effect, you can apply 3D CSS transforms to the marquee container or its children. The following example shows how you can apply them on the container.

Example:

```tsx
import React, { useEffect, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import SimpleMarquee from "@/fancy/components/blocks/simple-marquee"

// Interface for album data
interface Album {
  coverArt: string
  title: string
  artist: string
}

const hardcodedAlbums: Album[] = [
  {
    coverArt:
      "https://ia600207.us.archive.org/28/items/mbid-770b9b80-10e1-4297-b1fd-46ad0dbb0305/mbid-770b9b80-10e1-4297-b1fd-46ad0dbb0305-1148987477_thumb500.jpg",
    title: "Homework",
    artist: "Daft Punk",
  },
  {
    coverArt:
      "https://ia800905.us.archive.org/5/items/mbid-9da1a863-f3f2-4618-bdce-f0c88c055ba5/mbid-9da1a863-f3f2-4618-bdce-f0c88c055ba5-8201721911_thumb500.jpg",
    title: "✝",
    artist: "Justice",
  },
  {
    coverArt:
      "https://ia800909.us.archive.org/12/items/mbid-ee618541-23df-4973-afb7-e2d9f02e03d8/mbid-ee618541-23df-4973-afb7-e2d9f02e03d8-8154031977_thumb500.jpg",
    title: "By Your Side",
    artist: "Breakbot",
  },
  {
    coverArt:
      "https://ia800804.us.archive.org/20/items/mbid-3adfe4c6-0fa2-4813-a212-058d9a99b4a8/mbid-3adfe4c6-0fa2-4813-a212-058d9a99b4a8-16639897570_thumb500.jpg",
    title: "Still Waters",
    artist: "Breakbot",
  },
  {
    coverArt:
      "https://ia803403.us.archive.org/14/items/mbid-a7fcead9-ab9d-3d15-bb0d-a2b1945517dd/mbid-a7fcead9-ab9d-3d15-bb0d-a2b1945517dd-8093147470_thumb500.jpg",
    title: "Fancy Footwork",
    artist: "Chromeo",
  },
  {
    coverArt:
      "https://ia801301.us.archive.org/18/items/mbid-8acb4d6d-2cf9-4685-b4e8-5c9937621691/mbid-8acb4d6d-2cf9-4685-b4e8-5c9937621691-5651042668_thumb500.jpg",
    title: "Trax on da Rocks Vol. 2",
    artist: "Thomas Bangalter",
  },
  {
    coverArt:
      "https://ia904509.us.archive.org/32/items/mbid-cb844a4d-c02f-3199-b949-1656b36722da/mbid-cb844a4d-c02f-3199-b949-1656b36722da-8145217760_thumb500.jpg",
    title: "1999",
    artist: "Cassius",
  },
  {
    coverArt:
      "https://ia903201.us.archive.org/6/items/mbid-747ed90c-6479-4cec-a98a-b320a5ef75be/mbid-747ed90c-6479-4cec-a98a-b320a5ef75be-18417637214_thumb500.jpg",
    title: "Woman",
    artist: "Justice",
  },
  {
    coverArt:
      "https://ia800200.us.archive.org/5/items/mbid-9d0a791d-c0ed-4b99-bb31-976fad672408/mbid-9d0a791d-c0ed-4b99-bb31-976fad672408-1959533822_thumb500.jpg",
    title: "Modjo",
    artist: "Modjo",
  },
  {
    coverArt:
      "https://ia903106.us.archive.org/23/items/mbid-bbfc83ad-826f-4957-893d-a808105c828b/mbid-bbfc83ad-826f-4957-893d-a808105c828b-25063975521_thumb500.jpg",
    title: "Random Access Memories",
    artist: "Daft Punk",
  },
]

export default function SimpleMarqueeDemo() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setAlbums(hardcodedAlbums)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const firstRow = albums.slice(0, Math.floor(albums.length / 2))
  const secondRow = albums.slice(Math.floor(albums.length / 2))

  const MarqueeItem = ({ album, index }: { album: Album; index: number }) => {
    const variants = {
      initial: {
        y: "0px",
        x: "0px",
        scale: 1,
        opacity: 1,
      },
      hover: {
        y: "-12px",
        x: "-12px",
        scale: 1.05,
        transition: {
          duration: 0.15,
          ease: "easeOut",
        },
      },
    }

    const textVariants = {
      initial: {
        opacity: 0,
      },
      hover: {
        opacity: 1,
        transition: {
          duration: 0.15,
          ease: "easeOut",
        },
      },
    }

    const imageVariants = {
      initial: {
        opacity: 1,
      },
      hover: {
        opacity: 0.45,
        transition: {
          duration: 0.15,
          ease: "easeOut",
        },
      },
    }

    const containerClasses = cn(
      "mx-2 sm:mx-3 md:mx-4 cursor-pointer",
      "h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48",
      "relative flex shadow-white/20 shadow-md",
      "overflow-hidden flex-col transform-gpu bg-black"
    )

    const textContainerClasses = cn(
      "justify-end p-2 sm:p-2.5 md:p-3 h-full flex items-start flex-col",
      "leading-tight"
    )

    const imageClasses = cn("object-cover w-full h-full shadow-2xl absolute")

    return (
      <motion.div
        className={containerClasses}
        initial="initial"
        whileHover="hover"
        variants={variants}
      >
        <motion.div className={textContainerClasses} variants={textVariants}>
          <h3 className="text-white text-sm sm:text-base md:text-lg font-medium z-30">
            {album.title}
          </h3>
          <p className="text-neutral-300 text-xs sm:text-sm md:text-base z-30">
            {album.artist}
          </p>
        </motion.div>
        <motion.img
          src={album.coverArt}
          alt={`${album.title} by ${album.artist}`}
          draggable={false}
          className={imageClasses}
          variants={imageVariants}
        />
      </motion.div>
    )
  }

  return (
    <div
      className="flex w-dvw h-dvh relative justify-center items-center flex-col bg-black overflow-y-auto overflow-x-hidden"
      ref={(node) => setContainer(node)}
    >
      <h1 className="absolute text-center text-3xl sm:text-5xl md:text-6xl top-1/4 text-white font-calendas">
        Weekly Mix
      </h1>

      {loading ? (
        <div className="text-white">Loading album covers...</div>
      ) : (
        <>
          <div
            className="absolute h-1/2 sm:h-full w-[200%] top-32 -left-3/4 justify-center items-center flex flex-col space-y-2 sm:space-y-3 md:space-y-4 perspective-near"
            style={{
              transform:
                "rotateX(45deg) rotateY(-15deg) rotateZ(35deg) translateZ(-200px)",
            }}
          >
            <SimpleMarquee
              className="w-full"
              baseVelocity={10}
              repeat={3}
              draggable={false}
              scrollSpringConfig={{ damping: 50, stiffness: 400 }}
              slowDownFactor={0.2}
              slowdownOnHover
              slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
              scrollAwareDirection={true}
              scrollContainer={{ current: container }}
              useScrollVelocity={true}
              direction="left"
            >
              {firstRow.map((album, i) => (
                <MarqueeItem key={i} index={i} album={album} />
              ))}
            </SimpleMarquee>

            <SimpleMarquee
              className="w-full"
              baseVelocity={10}
              repeat={3}
              scrollAwareDirection={true}
              scrollSpringConfig={{ damping: 50, stiffness: 400 }}
              slowdownOnHover
              slowDownFactor={0.2}
              slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
              useScrollVelocity={true}
              scrollContainer={{ current: container }}
              draggable={false}
              direction="right"
            >
              {secondRow.map((album, i) => (
                <MarqueeItem key={i} index={i} album={album} />
              ))}
            </SimpleMarquee>
          </div>
        </>
      )}
    </div>
  )
}

```

For angled marquees, you can also apply the `dragAngle` prop to change the direction of the drag movement. This is useful if you want to rotate the marquee e.g. by 45 degrees.

### 3D transforms

```tsx
// Convert dragAngle from degrees to radians
const angleInRadians = (dragAngle * Math.PI) / 180

// Calculate the projection of the movement along the angle direction
const directionX = Math.cos(angleInRadians)
const directionY = Math.sin(angleInRadians)

// Project the movement onto the angle direction
const projectedDelta = deltaX * directionX + deltaY * directionY
```

## Resources

- [Scroll animations from Motion](https://motion.dev/docs/react-scroll-animations)
- [Easings](https://easings.net/)
- [CSS Only implementation from Frontend FYI](https://www.youtube.com/watch?v=uw5jVO1eNF8)
- [Gradient artworks](https://www.cosmos.so/danielpetho/gradients)
- [Album covers](https://musicbrainz.org/doc/Cover_Art_Archive/API)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `ReactNode` | - | The elements to be scrolled |
| className | `string` | - | Additional CSS classes for the container |
| direction | `"left" | "right" | "up" | "down"` | `right` | The direction of the marquee. Set to `"left"` or `"right"` to scroll from left to right, or `"up"` or `"down"` to scroll from top to bottom |
| baseVelocity | `number` | `5` | The base velocity of the marquee in pixels per second |
| easing | `(value: number) => number` | - | The easing function for the animation |
| slowdownOnHover | `boolean` | `false` | Whether to slow down the animation on hover |
| slowDownFactor | `number` | `0.3` | The factor to slow down the animation on hover |
| slowDownSpringConfig | `SpringOptions` | `{ damping: 50, stiffness: 400 }` | The spring config for the slow down animation |
| useScrollVelocity | `boolean` | `false` | Whether to use the scroll velocity to control the marquee speed |
| scrollAwareDirection | `boolean` | `false` | Whether to adjust the direction based on the scroll direction |
| scrollSpringConfig | `SpringOptions` | `{ damping: 50, stiffness: 400 }` | The spring config for the scroll velocity-based direction adjustment |
| scrollContainer | `RefObject | HTMLElement | null` | - | The container to use for the scroll velocity. If not provided, the window will be used. |
| repeat | `number` | `3` | The number of times to repeat the children |
| draggable | `boolean` | `false` | Whether to allow dragging of the marquee |
| dragSensitivity | `number` | `0.2` | The sensitivity of the drag movement |
| dragVelocityDecay | `number` | `0.96` | The decay of the drag velocity when released |
| dragAwareDirection | `boolean` | `false` | Whether to adjust the direction based on the drag velocity |
| dragAngle | `number` | `0` | The angle of the drag movement in degrees |
| grabCursor | `boolean` | `false` | Whether to change the cursor to grabbing when dragging |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/simple-marquee).*