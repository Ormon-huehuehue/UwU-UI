# Float

> A component that creates a gentle floating effect on its child.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [float](#float)
- [Usage](#usage)
- [Understanding the component](#understanding-the-component)
- [Examples](#examples)
- [Props](#props)

Example:

```tsx
"use client"

import { exampleImages } from "@/utils/demo-images"
import { motion } from "motion/react"

import Float from "@/fancy/components/blocks/float"

export default function FloatDemo() {
  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center bg-white text-foreground dark:text-muted">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
        >
          <Float>
            <div className="sm:w-40 sm:h-40 h-32 w-32 md:w-48 md:h-48 shadow-2xl relative overflow-hidden  hover:scale-105 duration-200 cursor-pointer transition-transform">
              <img
                src={exampleImages[4].url}
                className="w-full h-full object-cover absolute top-0 left-0"
              />
            </div>
          </Float>
        </motion.div>
        <motion.h2
          className="pt-8 sm:pt-12 md:pt-16 text-xl sm:text-3xl md:text-4xl uppercase z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.7, ease: "easeOut" }}
        >
          Album of the week
        </motion.h2>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/float.json"
```

### Manual

#### float

```tsx
"use client"

import React, { useRef } from "react"
import { motion, useAnimationFrame, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

type FloatProps = {
  children: React.ReactNode
  speed?: number
  amplitude?: [number, number, number] // [x, y, z]
  rotationRange?: [number, number, number] // [x, y, z]
  timeOffset?: number
  className?: string
}

const Float: React.FC<FloatProps> = ({
  children,
  speed = 0.5,
  amplitude = [10, 30, 30], // Default [x, y, z] amplitudes
  rotationRange = [15, 15, 7.5], // Default [x, y, z] rotation ranges
  timeOffset = 0,
  className,
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const z = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const rotateZ = useMotionValue(0)

  // Use refs for animation values to avoid recreating the animation frame callback
  const time = useRef(0)

  useAnimationFrame(() => {
    time.current += speed * 0.02

    // Smooth floating motion on all axes
    const newX = Math.sin(time.current * 0.7 + timeOffset) * amplitude[0]
    const newY = Math.sin(time.current * 0.6 + timeOffset) * amplitude[1]
    const newZ = Math.sin(time.current * 0.5 + timeOffset) * amplitude[2]

    // 3D rotations with different frequencies for more organic movement
    const newRotateX =
      Math.sin(time.current * 0.5 + timeOffset) * rotationRange[0]
    const newRotateY =
      Math.sin(time.current * 0.4 + timeOffset) * rotationRange[1]
    const newRotateZ =
      Math.sin(time.current * 0.3 + timeOffset) * rotationRange[2]

    x.set(newX)
    y.set(newY)
    z.set(newZ)
    rotateX.set(newRotateX)
    rotateY.set(newRotateY)
    rotateZ.set(newRotateZ)
  })

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateX,
        rotateY,
        rotateZ,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}

export default Float

```

## Usage

Just wrap your content you want to float with the `Float` component, and the animation will take care of the rest.

## Understanding the component

The component creates a smooth floating animation using sine waves for both movement and rotation. It accepts three main props:

1. **Movement**: The `amplitude` prop controls movement range on X, Y and Z axes in pixels.

2. **Rotation**: The `rotationRange` prop sets maximum rotation angles in degrees for each axis.

3. **Animation Speed**: The `speed` prop (default: 0.5) controls animation speed - higher is faster.

## Examples

By default, multiple Float components will move in unison. Use the `timeOffset` prop to create more organic movement.

Example:

```tsx
import { cn } from "@/lib/utils"
import Float from "@/fancy/components/blocks/float"

export default function FloatDemo() {
  const texts = [
    { text: "@mdx-js/loader", position: "top-[0%] left-[20%]" },
    { text: "@mdx-js/react", position: "top-[20%] left-[80%]" },
    { text: "@next/mdx", position: "top-[70%] left-[40%]" },
    { text: "@vercel/analytics", position: "top-[80%] left-[30%]" },
    { text: "class-variance-authority", position: "top-[40%] left-[0%]" },
    { text: "clsx", position: "top-[15%] left-[45%]" },
    { text: "flubber", position: "top-[65%] left-[85%]" },
    { text: "motion", position: "top-[85%] left-[15%]" },
    { text: "lenis", position: "top-[35%] left-[75%]" },
    { text: "lodash", position: "top-[75%] left-[55%]" },
    { text: "lucide-react", position: "top-[25%] left-[35%]" },
    { text: "matter-js", position: "top-[45%] left-[25%]" },
    { text: "mdast-util-toc", position: "top-[55%] left-[65%]" },
    { text: "next", position: "top-[90%] left-[45%]" },
    { text: "next-mdx-remote", position: "top-[10%] left-[70%]" },
    { text: "poly-decomp", position: "top-[60%] left-[10%]" },
    { text: "react", position: "top-[30%] left-[50%]" },
    { text: "react-dom", position: "top-[95%] left-[60%]" },
    { text: "react-syntax-highlighter", position: "top-[5%] left-[90%]" },
    { text: "react-wrap-balancer", position: "top-[82%] left-[75%]" },
    { text: "rehype-pretty-code", position: "top-[28%] left-[15%]" },
    { text: "remark", position: "top-[67%] left-[5%]" },
    { text: "svg-path-commander", position: "top-[92%] left-[25%]" },
    { text: "tailwind-merge", position: "top-[28%] left-[95%]" },
    { text: "tailwindcss-animate", position: "top-[73%] left-[20%]" },
    { text: "zod", position: "top-[8%] left-[40%]" },
  ]

  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center bg-white relative">
      {texts.map((item, i) => (
        <Float
          key={i}
          timeOffset={i * 0.8}
          amplitude={[
            15 + Math.random() * 20,
            25 + Math.random() * 30,
            20 + Math.random() * 25,
          ]}
          rotationRange={[
            10 + Math.random() * 10,
            10 + Math.random() * 10,
            5 + Math.random() * 5,
          ]}
          speed={0.3 + Math.random() * 0.4}
          className={cn(
            "absolute text-lg flex sm:text-xl md:text-2xl font-light hover:underline cursor-pointer text-[#0015ff]",
            item.position
          )}
        >
          <p>{item.text}</p>
        </Float>
      ))}
    </div>
  )
}

```

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be animated |
| speed | `number` | `0.5` | Speed of the floating animation |
| amplitude | `[number, number, number]` | `[10, 30, 30]` | Movement range in pixels for X, Y and Z axes |
| rotationRange | `[number, number, number]` | `[15, 15, 7.5]` | Maximum rotation in degrees for X, Y and Z axes |
| timeOffset | `number` | `0` | Offset to stagger animations between multiple instances |
| className | `string` | - | Additional CSS classes for styling |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/float).*