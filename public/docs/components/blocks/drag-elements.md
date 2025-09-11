# Drag Elements

> Drag any html element — image, div, video — around freely in a container.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [drag-elements](#drag-elements)
- [Usage](#usage)
- [Examples](#examples)
  - [Drag momentum](#drag-momentum)
- [Notes](#notes)
- [Props](#props)

Example:

```tsx
import React from "react"
import Image from "next/image"

import useScreenSize from "@/hooks/use-screen-size"
import DragElements from "@/fancy/components/blocks/drag-elements"

const urls = [
  "https://images.unsplash.com/photo-1683746531526-3bca2bc901b8?q=80&w=1820&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1631561729243-9b3291efceae?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1635434002329-8ab192fe01e1?q=80&w=2828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1719586799413-3f42bb2a132d?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1720561467986-ca3d408ca30b?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1724403124996-64115f38cd3f?q=80&w=3082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const DragElementsDemo: React.FC = () => {
  const screenSize = useScreenSize()
  return (
    <div className="w-dvw h-dvh relative bg-[#eeeeee] overflow-hidden">
      <h1 className="absolute text-xl md:text-4xl md:ml-36 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground uppercase w-full">
        all your
        <span className="font-bold text-foreground dark:text-muted">
          {" "}
          memories.{" "}
        </span>
      </h1>
      <DragElements dragMomentum={false} className="p-40">
        {urls.map((url, index) => {
          const rotation = randomInt(-12, 12)
          const width = screenSize.lessThan(`md`)
            ? randomInt(90, 120)
            : randomInt(120, 150)
          const height = screenSize.lessThan(`md`)
            ? randomInt(120, 140)
            : randomInt(150, 180)

          return (
            <div
              key={index}
              className={`flex items-start justify-center bg-white shadow-2xl p-4`}
              style={{
                transform: `rotate(${rotation}deg)`,
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <div
                className={`relative overflow-hidden`}
                style={{
                  width: `${width - 4}px`,
                  height: `${height - 30}px`,
                }}
              >
                <Image
                  src={url}
                  fill
                  alt={`Analog photo ${index + 1}`}
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
          )
        })}
      </DragElements>
    </div>
  )
}

export default DragElementsDemo

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/drag-elements.json"
```

### Manual

#### drag-elements

```tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { InertiaOptions, motion } from "motion/react"

type DragElementsProps = {
  children: React.ReactNode
  dragElastic?:
    | number
    | { top?: number; left?: number; right?: number; bottom?: number }
    | boolean
  dragConstraints?:
    | { top?: number; left?: number; right?: number; bottom?: number }
    | React.RefObject<Element>
  dragMomentum?: boolean
  dragTransition?: InertiaOptions
  dragPropagation?: boolean
  selectedOnTop?: boolean
  className?: string
}

const DragElements: React.FC<DragElementsProps> = ({
  children,
  dragElastic = 0.5,
  dragConstraints,
  dragMomentum = true,
  dragTransition = { bounceStiffness: 200, bounceDamping: 300 },
  dragPropagation = true,
  selectedOnTop = true,
  className,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [zIndices, setZIndices] = useState<number[]>([])

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setZIndices(
      Array.from({ length: React.Children.count(children) }, (_, i) => i)
    )
  }, [children])

  const bringToFront = (index: number) => {
    if (selectedOnTop) {
      setZIndices((prevIndices) => {
        const newIndices = [...prevIndices]
        const currentIndex = newIndices.indexOf(index)
        newIndices.splice(currentIndex, 1)
        newIndices.push(index)
        return newIndices
      })
    }
  }

  return (
    <div ref={constraintsRef} className={`relative w-full h-full ${className}`}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          drag
          dragElastic={dragElastic}
          dragConstraints={dragConstraints || constraintsRef}
          dragMomentum={dragMomentum}
          dragTransition={dragTransition}
          dragPropagation={dragPropagation}
          style={{
            zIndex: zIndices.indexOf(index),

            cursor: isDragging ? "grabbing" : "grab",
          }}
          onDragStart={() => {
            bringToFront(index)
            setIsDragging(true)
          }}
          onDragEnd={() => setIsDragging(false)}
          whileDrag={{ cursor: "grabbing" }}
          className={"absolute"}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default DragElements

```

## Usage

You only need to wrap your elements with the `DragElements` component, everything else is taken care of by the component itself.

Under the hood, the component wraps all the children in a `relative` container, then sets all children to `absolute` to allow free dragging. For the dragging events and logic it uses motion`s Drag gestures.

The children are constrained to move withing the container, but you can set the `dragConstraints` prop to define a custom container, or custom `top`, `bottom`, `left` and `right` value. For the other drag props, refer to motion's [Drag gestures](https://motion.dev/docs/react-gestures#drag) documentation.

In the demo above, the `dragMomentum` prop is set to `false` to disable the "physics-based" movement, but in the following example, you can see a more funky use-case where it is enabled.

## Examples

### Drag momentum

Example:

```tsx
import React from "react"

import DragElements from "@/fancy/components/blocks/drag-elements"

const DragElementsDemo: React.FC = () => {
  return (
    <div className="w-dvw h-dvh relative bg-[#1f464d] text-[#1f464d] overflow-hidden">
      <DragElements dragMomentum={true} className="p-30 md:p-40">
        <div className="text-2xl md:text-6xl px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#e794da] shadow-lg rotate-[-2deg] justify-center items-center">
          super fun ✿
        </div>
        <div className="text-2xl md:text-6xl px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#e794da] shadow-lg rotate-[2deg] justify-center items-center">
          funky time! ✴
        </div>
        <div className="text-2xl md:text-6xl px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#e794da] shadow-lg rotate-[-4deg] justify-center items-center">
          awesome ✺
        </div>
      </DragElements>
    </div>
  )
}

export default DragElementsDemo

```

## Notes

If you use images, or videos, make sure to set the `draggable` attribute to `false`, as they have priority for drag events.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The elements to be dragged |
| dragElastic | `number | { top?: number; left?: number; right?: number; bottom?: number } | boolean` | `0.5` | Determines how much the element can be dragged outside the constraints |
| dragConstraints | `{ top?: number; left?: number; right?: number; bottom?: number } | React.RefObject` | - | An object with top, left, right, bottom properties, or a ref to another element, to constrain the drag area |
| dragMomentum | `boolean` | `true` | If true, the element will continue moving when the drag gesture ends |
| dragTransition | `InertiaOptions` | `{ bounceStiffness: 200, bounceDamping: 300 }` | Specifies the spring physics for the drag end animation |
| dragPropagation | `boolean` | `true` | If true, allows dragging events to propagate to parent drag gestures |
| selectedOnTop | `boolean` | `true` | If true, brings the dragged element to the front |
| className | `string` | - | Additional CSS classes for the container |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/drag-elements).*