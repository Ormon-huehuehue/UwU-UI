# 3D CSS Box

> A simple 3D box component with CSS-only 3D transforms.

## Table of Contents

- [Credits](#credits)
- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [css-box](#css-box)
- [Usage](#usage)
  - [High-level cube example](#high-level-cube-example)
- [Understanding the component](#understanding-the-component)
  - [Face layout](#face-layout)
  - [Face layout](#face-layout)
  - [Rotation mechanics](#rotation-mechanics)
  - [Rotation mechanics](#rotation-mechanics)
  - [Drag interaction](#drag-interaction)
  - [Mouse movement to rotation](#mouse-movement-to-rotation)
  - [Drag interaction](#drag-interaction)
  - [Imperative API](#imperative-api)
- [Notes](#notes)
- [Resources](#resources)
- [Props](#props)
- [Ref Methods](#ref-methods)

Example:

```tsx
import { useRef } from "react"

import CSSBox, { CSSBoxRef } from "@/fancy/components/blocks/css-box"

export default function CSSBoxDemo() {
  const boxRef = useRef<CSSBoxRef>(null)

  // Example text face component
  const TextFace = ({
    texts,
    className,
  }: {
    texts: string[]
    className?: string
  }) => (
    <div className={`flex flex-col ${className || ""}`}>
      {texts.map((text, i) => (
        <div key={i} className="text-[#0015ff] font-bold tracking-wider">
          {text}
        </div>
      ))}
    </div>
  )

  return (
    <CSSBox
      ref={boxRef}
      width={200}
      height={200}
      depth={200}
      perspective={600}
      stiffness={100}
      damping={30}
      faces={{
        front: (
          <TextFace
            texts={["YOU CAN", "JUST", "DO THINGS"]}
            className="text-right justify-end items-end h-full w-full p-2 select-none"
          />
        ),
        back: (
          <TextFace
            texts={["MAKE THINGS", "YOU WISH", "EXISTED"]} 
            className="text-left justify-end h-full w-full p-2 select-none"
          />
        ),
        right: (
          <TextFace
            texts={["MAKE THINGS", "YOU WISH", "EXISTED"]}
            className="text-left justify-end h-full w-full p-2 select-none"
          />
        ),
        left: (
          <TextFace
            texts={["BREAK", "THINGS", "MOVE", "FAST"]}
            className="items-end w-full h-full p-2 select-none"
          />
        ),
        top: (
          <TextFace
            texts={["YOU CAN", "JUST", "DO THINGS"]}
            className="text-right justify-end items-end h-full w-full p-2 select-none" 
          />
        ),
        bottom: (
          <TextFace
            texts={["BREAK", "THINGS", "MOVE", "FAST"]}
            className="items-end w-full h-full p-2 select-none"
          />
        ),
      }}
      className="text-3xl"
    />
  )
}

```

Artwork inspiration from [Ignite Amsterdam](https://www.instagram.com/p/CaDHtZKrk0F/)

## Credits

The component is derived from the Box chapter of David De Sandro's [extremely awesome Intro to CSS 3D transforms tutorial](https://3dtransforms.desandro.com/box). 

Ported to Framer by [Framer University](https://framer.university/)

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/3d-css-box.json"
```

### Manual

#### css-box

```tsx
"use client"

import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

interface FaceProps {
  transform: string
  className?: string
  showBackface?: boolean
  children?: ReactNode
  style?: React.CSSProperties
}

const CubeFace = ({
  transform,
  className,
  showBackface,
  children,
  style,
}: FaceProps) => (
  <div
    className={cn(
      "absolute",
      showBackface ? "backface-visible" : "backface-hidden",
      className
    )}
    style={{ transform, ...style }}
  >
    {children}
  </div>
)

interface CubeFaces {
  front?: ReactNode
  back?: ReactNode
  right?: ReactNode
  left?: ReactNode
  top?: ReactNode
  bottom?: ReactNode
}

export interface CSSBoxRef {
  showFront: () => void
  showBack: () => void
  showLeft: () => void
  showRight: () => void
  showTop: () => void
  showBottom: () => void
  rotateTo: (x: number, y: number) => void
  getCurrentRotation: () => { x: number; y: number }
}

interface CSSBoxProps extends React.HTMLProps<HTMLDivElement> {
  width: number
  height: number
  depth: number
  className?: string
  perspective?: number
  stiffness?: number
  damping?: number
  showBackface?: boolean
  faces?: CubeFaces
  draggable?: boolean
}

const CSSBox = forwardRef<CSSBoxRef, CSSBoxProps>(
  (
    {
      width,
      height,
      depth,
      className,
      perspective = 600,
      stiffness = 100,
      damping = 30,
      showBackface = false,
      faces = {},
      draggable = true,
      ...props
    },
    ref
  ) => {
    const isDragging = useRef(false)
    const startPosition = useRef({ x: 0, y: 0 })
    const startRotation = useRef({ x: 0, y: 0 })

    const baseRotateX = useMotionValue(0)
    const baseRotateY = useMotionValue(0)

    const springRotateX = useSpring(baseRotateX, {
      stiffness,
      damping,
      ...(isDragging.current ? { stiffness: stiffness / 2 } : {}),
    })
    const springRotateY = useSpring(baseRotateY, {
      stiffness,
      damping,
      ...(isDragging.current ? { stiffness: stiffness / 2 } : {}),
    })

    const currentRotation = useRef({ x: 0, y: 0 })

    useImperativeHandle(
      ref,
      () => ({
        showFront: () => {
          baseRotateX.set(0)
          baseRotateY.set(0)
        },
        showBack: () => {
          baseRotateX.set(0)
          baseRotateY.set(180)
        },
        showLeft: () => {
          baseRotateX.set(0)
          baseRotateY.set(-90)
        },
        showRight: () => {
          baseRotateX.set(0)
          baseRotateY.set(90)
        },
        showTop: () => {
          baseRotateX.set(-90)
          baseRotateY.set(0)
        },
        showBottom: () => {
          baseRotateX.set(90)
          baseRotateY.set(0)
        },
        rotateTo: (x: number, y: number) => {
          baseRotateX.set(x)
          baseRotateY.set(y)
        },

        getCurrentRotation: () => currentRotation.current,
      }),
      []
    )

    const transform = useTransform(
      [springRotateX, springRotateY],
      ([x, y]) =>
        `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`
    )
    const handleStart = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!draggable) return
        isDragging.current = true
        const point = 'touches' in e ? e.touches[0] : e
        startPosition.current = { x: point.clientX, y: point.clientY }
        startRotation.current = {
          x: baseRotateX.get(),
          y: baseRotateY.get(),
        }
      },
      [draggable]
    )

    const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return
      const point = 'touches' in e ? e.touches[0] : e
      const deltaX = point.clientX - startPosition.current.x
      const deltaY = point.clientY - startPosition.current.y
      baseRotateX.set(startRotation.current.x - deltaY / 2)
      baseRotateY.set(startRotation.current.y + deltaX / 2)
    }, [])

    const handleEnd = useCallback(() => {
      isDragging.current = false
    }, [])

    useEffect(() => {
      if (draggable) {
        window.addEventListener("mousemove", handleMove)
        window.addEventListener("mouseup", handleEnd)
        window.addEventListener("touchmove", handleMove)
        window.addEventListener("touchend", handleEnd)
        return () => {
          window.removeEventListener("mousemove", handleMove)
          window.removeEventListener("mouseup", handleEnd)
          window.removeEventListener("touchmove", handleMove)
          window.removeEventListener("touchend", handleEnd)
        }
      }
    }, [draggable, handleMove, handleEnd])

    useEffect(() => {
      const unsubscribeX = baseRotateX.on("change", (v) => {
        currentRotation.current.x = v
      })
      const unsubscribeY = baseRotateY.on("change", (v) => {
        currentRotation.current.y = v
      })
      return () => {
        unsubscribeX()
        unsubscribeY()
      }
    }, [])

    return (
      <div
        className={cn(draggable && "cursor-move", className)}
        style={{
          width,
          height,
          perspective: `${perspective}px`,
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        {...props}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          style={{ transform }}
        >
          {/* Front and Back */}
          <CubeFace
            transform={`rotateY(0deg) translateZ(${depth / 2}px)`}
            style={{ width, height }}
            showBackface={showBackface}
          >
            {faces.front}
          </CubeFace>

          <CubeFace
            transform={`rotateY(180deg) translateZ(${depth / 2}px)`}
            style={{ width, height }}
            showBackface={showBackface}
          >
            {faces.back}
          </CubeFace>

          {/* Right and Left */}
          <CubeFace
            transform={`rotateY(90deg) translateZ(${width / 2}px)`}
            style={{
              width: depth,
              height,
              left: (width - depth) / 2,
            }}
            showBackface={showBackface}
          >
            {faces.right}
          </CubeFace>

          <CubeFace
            transform={`rotateY(-90deg) translateZ(${width / 2}px)`}
            style={{
              width: depth,
              height,
              left: (width - depth) / 2,
            }}
            showBackface={showBackface}
          >
            {faces.left}
          </CubeFace>

          {/* Top and Bottom */}
          <CubeFace
            transform={`rotateX(90deg) translateZ(${height / 2}px)`}
            style={{
              width,
              height: depth,
              top: (height - depth) / 2,
            }}
            showBackface={showBackface}
          >
            {faces.top}
          </CubeFace>

          <CubeFace
            transform={`rotateX(-90deg) translateZ(${height / 2}px)`}
            style={{
              width,
              height: depth,
              top: (height - depth) / 2,
            }}
            showBackface={showBackface}
          >
            {faces.bottom}
          </CubeFace>
        </motion.div>
      </div>
    )
  }
)

CSSBox.displayName = "CSSBox"

export default CSSBox

```

## Usage

The component renders a fully-featured 3D cube. Pass `width`, `height`, `depth` and optionally six React nodes for the faces. You may also grab the cube with a ref for programmatic control. 

### High-level cube example

```tsx
import { useRef } from "react"
import CSSBox, { CSSBoxRef } from "@/components/blocks/css-box"

export default function CubeExample() {
  const cubeRef = useRef<CSSBoxRef>(null)

  return (
    <>
      <CSSBox
        ref={cubeRef}
        width={220}
        height={220}
        depth={220}
        perspective={800}
        draggable
        faces={{
          front:  <img src="/images/front.png"  alt="Front"  />,
          back:   <img src="/images/back.png"   alt="Back"   />,
          left:   <img src="/images/left.png"   alt="Left"   />,
          right:  <img src="/images/right.png"  alt="Right"  />,
          top:    <img src="/images/top.png"    alt="Top"    />,
          bottom: <img src="/images/bottom.png" alt="Bottom" />,
        }}
      />

      <Button onClick={() => cubeRef.current?.showTop()}>
        Show Top
      </Button>
    </>
  )
}
```

## Understanding the component

Before you dive into it, I highly recommend reading [Intro to CSS 3D transforms](https://3dtransforms.desandro.com/) by David DeSandro. It's a really great resource for understanding the basics, and this component is essentially just a react & tailwind port of the Box chapter.

### Face layout

As you know, a box is a 3D object that has six faces. Each face is an absolutely-positioned `<div>` that lives in the same 3D context (`transform-style: preserve-3d`).  
We pre-rotate every face so that their local **+Z** axis points outward and then translate it by half of the appropriate dimension:

### Face layout

```tsx
rotateY( 0deg) translateZ(depth / 2) → front
rotateY(180deg) translateZ(depth / 2) → back
rotateY( 90deg) translateZ(width / 2) → right
rotateY(-90deg) translateZ(width / 2) → left
rotateX( 90deg) translateZ(height/ 2) → top
rotateX(-90deg) translateZ(height/ 2) → bottom
```

### Rotation mechanics

1. Two motion values `baseRotateX` and `baseRotateY` hold the raw rotation in degrees.  
2. They are piped through `useSpring` so they feel springy and configurable (`stiffness`, `damping`). See [Motion – useSpring](https://motion.dev/docs/react-use-spring) for more details.
3. We combine them into a single CSS transform:

### Rotation mechanics

```ts
const transform = useTransform([springX, springY], ([x, y]) =>
  `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`
)
```

### Drag interaction

The box can be rotated through mouse drags or touch input. 3D rotation can be a nasty thing, especially when dealing with [Gimbal Lock](https://base.movella.com/s/article/Understanding-Gimbal-Lock-and-how-to-prevent-it?language=en_US). While the almighty, super complex [quaternions](https://www.youtube.com/watch?v=zjMuIxRvygQ) could prevent this issue (Three.js provides great utilities for that), implementing them felt like overkill here - at that point, the entire box might as well be rendered in Three.js. 

The current approach maps mouse/touch movement directly to rotation around the X and Y axes. The implementation is pretty intuitive, while the actual feel of it can be sometimes unintuitive. Apologies for my laziness here.

When `draggable` is enabled, pointer movement gets translated into smooth rotational changes:

### Mouse movement to rotation

```ts
Δx → rotateY
Δy → rotateX
```

We do this by subscribing to `mousemove` and `touchmove` events and projecting the movement to rotation deltas. During dragging the spring’s stiffness is temporarily halved to give a slightly “looser” feel. 

### Drag interaction

```tsx
baseRotateX.set(startRotation.current.x - deltaY / 2)
baseRotateY.set(startRotation.current.y + deltaX / 2)
```

Modify that value to adjust the sensitivity of the drag.

### Imperative API

Via `ref` you can trigger the following methods:

- `showFront | showBack | showLeft | showRight | showTop | showBottom`
- `rotateTo(x: number, y: number)` – set exact angles
- `getCurrentRotation()` – read the live values

This can be handy for syncing cube state to a carousel or step-based walkthrough. For example, you can trigger a cube rotation with hover:

Example:

```tsx
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import CSSBox, { CSSBoxRef } from "@/fancy/components/blocks/css-box"

const BoxText = ({
  children,
  className,
  i,
}: {
  children: React.ReactNode
  className?: string
  i: number
}) => (
  <div
    className={cn(
      "w-full h-full uppercase text-white flex items-center justify-center p-0 text-2xl md:text-3xl font-bold",
      className
    )}
  >
    {children}
  </div>
)

export default function CSSBoxHoverDemo() {
  const boxRefs = useRef<(CSSBoxRef | null)[]>([])
  const isRotating = useRef<boolean[]>([])
  const currentRotations = useRef<number[]>([])

  const boxes = [
    { text: "January 15, 2025", size: 300 },
    { text: "Live Q&A", size: 200 },
    { text: "10:00", size: 120 },
    { text: "to", size: 70 },
    { text: "11:30", size: 120 },
    { text: "CET", size: 120 },
    { text: "Online", size: 180 },
    { text: "Recording Available", size: 380 },
    { text: "In English", size: 220 },
    { text: "Register Now", size: 280 },
    { text: "Free Access", size: 240 },
  ]

  useEffect(() => {
    currentRotations.current = new Array(boxes.length).fill(0)
  }, [])

  const handleHover = async (index: number) => {
    if (isRotating.current[index]) return

    isRotating.current[index] = true
    const box = boxRefs.current[index]
    if (!box) return

    const nextRotation = currentRotations.current[index] + 90
    currentRotations.current[index] = nextRotation

    box.rotateTo(0, nextRotation)

    isRotating.current[index] = false
  }

  return (
    <div className="flex flex-col items-center justify-center w-dvw h-dvh bg-[#111]">
      {boxes.map(({ text, size }, index) => (
        <CSSBox
          key={index}
          ref={(el) => {
            if (el) {
              boxRefs.current[index] = el
              isRotating.current[index] = false
              currentRotations.current[index] = 0
            }
          }}
          width={size}
          height={35}
          depth={size}
          draggable={false}
          className="hover:z-10"
          onMouseEnter={() => handleHover(index)}
          faces={{
            front: <BoxText i={index}>{text}</BoxText>,
            back: (
              <BoxText i={index} className="">
                {text}
              </BoxText>
            ),
            left: <BoxText i={index}>{text}</BoxText>,
            right: (
              <BoxText i={index} className="">
                {text}
              </BoxText>
            ),
          }}
        />
      ))}
    </div>
  )
}

```

Or, tie the rotation to a scroll progress:

Example:

```tsx
import { useRef } from "react"
import { useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import useScreenSize from "@/hooks/use-screen-size"
import CSSBox, { CSSBoxRef } from "@/fancy/components/blocks/css-box"

const BoxFace = ({
  imageUrl,
  className,
}: {
  imageUrl: string
  className?: string
}) => (
  <div className={cn("w-full h-full relative", className)}>
    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
    <div
      className="absolute inset-0"
      style={{
        maskImage: "linear-gradient(to top, white 20%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, white 20%, transparent 100%)",
        backgroundColor: "rgba(255,255,255,0.4)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="absolute bottom-0 w-full flex flex-col items-start justify-end pb-3">
        <div className="flex w-full justify-between px-2 items-end">
          <div className="text-[8px] font-black pb-1">JUN14</div>
          <div className="text-3xl md:text-5xl font-black px-2">
            New Arrivals
          </div>
          <div className="text-lg md:text-xl font-medium">SS25</div>
        </div>
      </div>
    </div>
  </div>
)

export default function CSSBoxScrollDemo() {
  const boxRef = useRef<CSSBoxRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const screenSize = useScreenSize()

  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  // Transform scroll progress (0-1) to rotation (0-360)
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360])

  // Update box rotation when scroll transform changes
  rotation.on("change", (latest) => {
    boxRef.current?.rotateTo(0, latest)
  })

  const imageUrl =
    "https://cdn.cosmos.so/276cdd4e-8a7a-4c32-955f-83c5900a0926?format=jpeg"

  const boxWidth = screenSize.lessThan("md") ? 220 : 300
  const boxHeight = screenSize.lessThan("md") ? 300 : 400
  const boxDepth = screenSize.lessThan("md") ? 220 : 300

  return (
    <div
      ref={containerRef}
      className="relative w-dvw h-dvh overflow-y-auto bg-[#fefefe] flex"
    >
      <div className="h-[400%] flex w-full items-start justify-center absolute">
        <div className="sticky py-28 md:py-16 top-0 left-0 px-6 md:px-12">
          <CSSBox
            ref={boxRef}
            width={boxWidth}
            height={boxHeight}
            depth={boxDepth}
            perspective={2000}
            draggable={false}
            faces={{
              front: <BoxFace imageUrl={imageUrl} />,
              back: <BoxFace imageUrl={imageUrl} />,
              left: <BoxFace imageUrl={imageUrl} />,
              right: <BoxFace imageUrl={imageUrl} />,
            }}
          />
        </div>
      </div>
    </div>
  )
}

```

## Notes

As it was pointed out above, implementing a similar component in Three.js would have been a lot easier and would give you much more flexibility and overall control over the rotation. You are still welcomed to use this component if you'd like to skip installing Three.js for whatever reason :). 

## Resources

- [Intro to CSS 3D transforms](https://3dtransforms.desandro.com/) by David DeSandro
- [Gimbal Lock](https://base.movella.com/s/article/Understanding-Gimbal-Lock-and-how-to-prevent-it?language=en_US) 
- [Quaternions explained](https://www.youtube.com/watch?v=zjMuIxRvygQ) by 3Blue1Brown

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| width* | `number` | - | Width of the cube (in&nbsp;px) |
| height* | `number` | - | Height of the cube (in&nbsp;px) |
| depth* | `number` | - | Depth of the cube (in&nbsp;px) |
| perspective | `number` | `600` | Perspective distance applied to the outer wrapper |
| stiffness | `number` | `100` | Spring stiffness for rotations |
| damping | `number` | `30` | Spring damping factor |
| className | `string` | - | Additional classes for the outer wrapper |
| showBackface | `boolean` | `false` | Reveal back-faces if you need double-sided content |
| faces | `{ front? back? left? right? top? bottom?: ReactNode }` | - | Individual React nodes for every face |
| draggable | `boolean` | `true` | Enable/disable mouse &amp; touch rotation |

## Ref Methods

The component exposes several methods through a ref that allow programmatic control of the cube's rotation:

<Table>
  <TableHead>
    <TableRow>
      <TableCell>Method</TableCell>
      <TableCell>Type</TableCell>
      <TableCell>Description</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>showFront</TableCell>
      <TableCell>`() => void`</TableCell>
      <TableCell>Rotates the cube to show the front face (0°, 0°)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>showBack</TableCell>
      <TableCell>`() => void`</TableCell>
      <TableCell>Rotates the cube to show the back face (0°, 180°)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>showLeft</TableCell>
      <TableCell>`() => void`</TableCell>
      <TableCell>Rotates the cube to show the left face (0°, -90°)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>showRight</TableCell>
      <TableCell>`() => void`</TableCell>
      <TableCell>Rotates the cube to show the right face (0°, 90°)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>showTop</TableCell>
      <TableCell>`() => void`</TableCell>
      <TableCell>Rotates the cube to show the top face (-90°, 0°)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>showBottom</TableCell>
      <TableCell>`() => void`</TableCell>
      <TableCell>Rotates the cube to show the bottom face (90°, 0°)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>rotateTo</TableCell>
      <TableCell>`(x: number, y: number) => void`</TableCell>
      <TableCell>Rotates the cube to specific X and Y angles in degrees</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>getCurrentRotation</TableCell>
      <TableCell>`() => { x: number, y: number }`</TableCell>
      <TableCell>Returns current X and Y rotation angles in degrees</TableCell>
    </TableRow>
  </TableBody>
</Table>

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/css-box).*