# Marquee Along SVG Path

> A component that scrolls html elements along an SVG path.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [marquee-along-svg-path](#marquee-along-svg-path)
- [Usage](#usage)
- [Understanding the component](#understanding-the-component)
  - [Offset path example](#offset-path-example)
  - [Item offset calculation](#item-offset-calculation)
  - [Z-Index Management](#z-index-management)
  - [Z-Index calculation](#z-index-calculation)
- [CSS Variable Interpolation](#css-variable-interpolation)
  - [CSS variable interpolation example](#css-variable-interpolation-example)
- [Notes](#notes)
- [Resources](#resources)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
import MarqueeAlongSvgPath from "@/fancy/components/blocks/marquee-along-svg-path"

const path =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5"

export default function MarqueeAlongSvgPathDemo() {
  return (
    <div className="w-dvw h-dvh bg-zinc-50 flex">
      <MarqueeAlongSvgPath
        path={path}
        baseVelocity={8}
        slowdownOnHover={true}
        draggable={true}
        repeat={2}
        dragSensitivity={0.1}
        className="absolute -left-24 sm:-left-32 top-32 scale-60 sm:scale-100"
        grabCursor
      >
        {imgs.map((img, i) => (
          <div
            key={i}
            className="w-14 h-full hover:scale-150 duration-300 ease-in-out"
          >
            <img
              src={img.src}
              alt={`Example ${i}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </MarqueeAlongSvgPath>
    </div>
  )
}

const imgs = [
  {
    src: "https://cdn.cosmos.so/b9909337-7a53-48bc-9672-33fbd0f040a1?format=jpeg",
    link: "https://www.instagram.com/p/DCOl6YTS85e/?igsh=MXNvdHhyczl1djJ6ZA%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/ecdc9dd7-2862-4c28-abb1-dcc0947390f3?format=jpeg",
    link: "https://www.instagram.com/p/C4RTJvVpP4R/?igsh=MWZwOTNlYTVodGszMw%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/79de41ec-baa4-4ac0-a9a4-c090005ca640?format=jpeg",
    link: "https://pangrampangram.com/products/mori",
  },
  {
    src: "https://cdn.cosmos.so/1a18b312-21cd-4484-bce5-9fb7ed1c5e01?format=jpeg",
    link: "https://www.sergidelgado.com/selected-work/ampersand",
  },
  {
    src: "https://cdn.cosmos.so/d765f64f-7a66-462f-8b2d-3d7bc8d7db55?format=jpeg",
    link: "https://www.instagram.com/p/C40XmANsoe_/?igsh=MXFlZGx4cmw3ZW1qYw%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/6b9f08ea-f0c5-471f-a620-71221ff1fb65?format=jpeg",
    link: "https://abduzeedo.com/super-stylish-type-explorations",
  },
  {
    src: "https://cdn.cosmos.so/40a09525-4b00-4666-86f0-3c45f5d77605?format=jpeg",
    link: "https://www.instagram.com/p/CrhdrGjr9yK/?igshid=MTc4MmM1YmI2Ng%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/14f05ab6-b4d0-4605-9007-8a2190a249d0?format=jpeg",
    link: "https://www.instagram.com/julian.stiber/p/By5RBApiDzE/?img_index=1",
  },
  {
    src: "https://cdn.cosmos.so/d05009a2-a2f8-4a4c-a0de-e1b0379dddb8?format=jpeg",
    link: "https://www.instagram.com/p/CeT3COysRNN/?img_index=2",
  },
  {
    src: "https://cdn.cosmos.so/ba646e35-efc2-494a-961b-b40f597e6fc9?format=jpeg",
    link: "https://www.instagram.com/godfreydadich/",
  },
  {
    src: "https://cdn.cosmos.so/e899f9c3-ed48-4899-8c16-fbd5a60705da?format=jpeg",
    link: "https://www.instagram.com/p/Bty1U6BhTOW/?img_index=5",
  },
  {
    src: "https://cdn.cosmos.so/24e83c11-c607-45cd-88fb-5059960b56a0?format=jpeg",
    link: "https://www.instagram.com/p/C48dxn1LqhC/?igsh=dmV5ZWR0Z2Y3Zzlt&img_index=3",
  },
  {
    src: "https://cdn.cosmos.so/cd346bce-f415-4ea7-8060-99c5f7c1741a?format=jpeg",
    link: "https://www.instagram.com/p/C08ZDVyyRhK/?img_index=2&igsh=bHAyZjcxYW1jZDNu",
  },
]

```

A start-to-finish tutorial on this component is available on [Codrops](https://tympanus.net/codrops/2025/06/17/building-an-infinite-marquee-along-an-svg-path-with-react-motion/?_thumbnail_id=95755).

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/marquee-along-svg-path.json"
```

### Manual

#### marquee-along-svg-path

```tsx
import React, { RefObject, useCallback, useEffect, useRef } from "react"
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

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax"

interface CSSVariableInterpolation {
  property: string
  from: number | string
  to: number | string
}

type PreserveAspectRatioMeetOrSlice = "meet" | "slice"

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode
  className?: string

  // Path properties
  path: string
  pathId?: string
  preserveAspectRatio?: PreserveAspectRatio
  showPath?: boolean

  // SVG properties
  width?: string | number
  height?: string | number
  viewBox?: string

  // Marquee properties
  baseVelocity?: number
  direction?: "normal" | "reverse"
  easing?: (value: number) => number
  slowdownOnHover?: boolean
  slowDownFactor?: number
  slowDownSpringConfig?: SpringOptions

  // Scroll properties
  useScrollVelocity?: boolean
  scrollAwareDirection?: boolean
  scrollSpringConfig?: SpringOptions
  scrollContainer?: RefObject<HTMLElement> | HTMLElement | null

  // Item repetition
  repeat?: number

  // Drag properties
  draggable?: boolean
  dragSensitivity?: number
  dragVelocityDecay?: number
  dragAwareDirection?: boolean
  grabCursor?: boolean

  // Z-index properties
  enableRollingZIndex?: boolean
  zIndexBase?: number
  zIndexRange?: number

  cssVariableInterpolation?: CSSVariableInterpolation[]
}

const MarqueeAlongSvgPath = ({
  children,
  className,

  // Path defaults
  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  // SVG defaults
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",

  // Marquee defaults
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  // Scroll defaults
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  // Items repetition
  repeat = 3,

  // Drag defaults
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  // Z-index defaults
  enableRollingZIndex = true,
  zIndexBase = 1, // Base z-index value
  zIndexRange = 10, // Range of z-index values to use

  cssVariableInterpolation = [],
}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null)
  const baseOffset = useMotionValue(0)

  const pathRef = useRef<SVGPathElement>(null)

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Create an array of items outside of the render function
  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex
        const key = `${childIndex}-${repeatIndex}`
        return {
          child,
          childIndex,
          repeatIndex,
          itemIndex,
          key,
        }
      })
    )
  }, [children, repeat])

  // Function to calculate z-index based on offset distance
  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) {
        return undefined
      }

      // Simple progress-based z-index
      const normalizedDistance = offsetDistance / 100
      return Math.floor(zIndexBase + normalizedDistance * zIndexRange)
    },
    [enableRollingZIndex, zIndexBase, zIndexRange]
  )

  // Generate a random ID for the path if not provided
  const id = pathId || `marquee-path-${Math.random().toString(36).substring(7)}`

  // Scroll tracking
  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement>) || container,
  })

  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig)

  // Hover and drag state tracking
  const isHovered = useRef(false)
  const isDragging = useRef(false)
  const dragVelocity = useRef(0)

  // Direction factor for changing direction based on scroll or drag
  const directionFactor = useRef(direction === "normal" ? 1 : -1)

  // Motion values for animation
  const hoverFactorValue = useMotionValue(1)
  const defaultVelocity = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)

  // Transform scroll velocity into a factor that affects marquee speed
  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  )

  // Animation frame handler
  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current)

      // Add decay to dragVelocity
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
      baseVelocity *
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
        directionFactor.current = Math.sign(dragVelocity.current)
      }

      // Gradually decay drag velocity back to zero
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay
      } else if (!isDragging.current) {
        dragVelocity.current = 0
      }
    }

    baseOffset.set(baseOffset.get() + moveBy)
  })

  // Pointer event handlers for dragging
  const lastPointerPosition = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return
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

    // Calculate movement delta - simplified for path movement
    const deltaX = currentPosition.x - lastPointerPosition.current.x
    const deltaY = currentPosition.y - lastPointerPosition.current.y

    // For path following, we use a simple magnitude of movement
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const projectedDelta = deltaX > 0 ? delta : -delta

    // Update drag velocity based on the projected movement
    dragVelocity.current = projectedDelta * dragSensitivity

    // Update last position
    lastPointerPosition.current = currentPosition
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    isDragging.current = false

    if (grabCursor) {
      ;(e.currentTarget as HTMLElement).style.cursor = "grab"
    }
  }

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        className="w-full h-full"
      >
        <path
          id={id}
          d={path}
          stroke={showPath ? "currentColor" : "none"}
          fill="none"
          ref={pathRef}
        />
      </svg>

      {items.map(({ child, repeatIndex, itemIndex, key }) => {
        // Create a unique offset transform for each item
        const itemOffset = useTransform(baseOffset, (v) => {
          const position = (itemIndex * 100) / items.length
          const wrappedValue = wrap(0, 100, v + position)
          return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`
        })

        // Create a motion value for the current offset distance
        const currentOffsetDistance = useMotionValue(0)

        // Update z-index when offset distance changes
        const zIndex = useTransform(currentOffsetDistance, (value) =>
          calculateZIndex(value)
        )

        // Update current offset distance value when animation runs
        useEffect(() => {
          const unsubscribe = itemOffset.on("change", (value: string) => {
            // Parse percentage string to get numerical value
            const match = value.match(/^([\d.]+)%$/)
            if (match && match[1]) {
              currentOffsetDistance.set(parseFloat(match[1]))
            }
          })
          return unsubscribe
        }, [itemOffset, currentOffsetDistance])

        const cssVariables = Object.fromEntries(
          (cssVariableInterpolation || []).map(({ property, from, to }) => [
            property,
            useTransform(currentOffsetDistance, [0, 100], [from, to]),
          ])
        )

        return (
          <motion.div
            key={key}
            ref={(el) => {
              if (el) itemRefs.current.set(key, el)
            }}
            className={cn(
              "absolute top-0 left-0",
              draggable && grabCursor && "cursor-grab"
            )}
            style={{
              offsetPath: `path('${path}')`,
              offsetDistance: itemOffset,
              zIndex: enableRollingZIndex ? zIndex : undefined,
              ...cssVariables,
            }}
            aria-hidden={repeatIndex > 0}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}

export default MarqueeAlongSvgPath

```

## Usage

1. Wrap your elements with the `MarqueeAlongSvgPath` component
2. Provide an SVG path via the required `path` prop (the `d` attribute of an SVG path)
3. Configure the SVG viewport with optional `viewBox` and `preserveAspectRatio` props for proper scaling
4. The elements are distributed evenly along the path, so you'll need to experiment with:
   - The `repeat` prop to control how many copies of your elements appear
   - The size of your elements (width/height)

The component is really similar to the [Simple Marquee Component](https://uwuui.com/docs/components/blocks/simple-marquee), and has the same features and props (and a bit more:)):

- Changing velocity based on scroll velocity
- Slow down on hover
- Draggable elements
- Custom easing

## Understanding the component

Before you dive into understanding this component, please read through the [Simple Marquee](https://uwuui.com/docs/components/blocks/simple-marquee.md) component's documentation, as this one is almost identical.

The main difference is that we move the children along an SVG path (instead of a "straight line" positioned with `flexbox` system, as in the other component). **The magic that makes this possible is the `offsetPath` CSS property.**

> The `offset-path` CSS property specifies a path for an element to follow and determines the element's positioning within the path's parent container or the SVG coordinate system. The path is a line, a curve, or a geometrical shape along which the element gets positioned or moves.

as per the [offset-path documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path).

We also use the `offsetDistance` property to actually move/offset the element to the correct position along the path in the `offsetPath` CSS property.

### Offset path example

```jsx
style={{
  ...
  offsetPath: `path('${path}')`,
  offsetDistance: itemOffset,
}}
```

Each item's offset is calculated separately using an `useTransform` hook from `motion/react`, by converting the `baseOffset` to a percentage value:

### Item offset calculation

```jsx
const itemOffset = useTransform(baseOffset, (v) => {
  // evenly distribute items along the path (0-100%)
  const position = (itemIndex * 100) / items.length
  const wrappedValue = wrap(0, 100, v + position)
  return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`
})
```

The items are evenly distributed along the path. The `wrap` function ensures that items surpassing `100%` are "wrapped back" to `0%`. The `baseOffset` value (the input value for the `useTransform` hook) is calculated by a bunch of different factors, such as:
- a base velocity, which moves the items along the path at a constant speed
- scroll velocity
- slowing down on hover
- direction
- drag velocity

Most of these factors are calculated inside an `useAnimationFrame` hook, which runs every frame. Most of these values are either motion values or refs to avoid unnecessary re-renders. Please refer to the [Simple Marquee Component documentation](https://uwuui.com/docs/components/blocks/simple-marquee.md), there is a detailed explanation for each part.

### Z-Index Management

You can enable increasing z-index based on the progress along the path by setting `enableRollingZIndex` to `true`. This is pretty useful when a path is self-crossing, so elements further along the path appear above earlier ones.

The callback function which calculates the current z-index is fairly simple. You can set the `zIndexBase` and `zIndexRange` props to control the base and range of the z-index values. The `zIndexBase` is the starting value, and the `zIndexRange` is the difference between the highest and lowest z-index values.

### Z-Index calculation

```jsx
// Function to calculate z-index based on offset distance
const calculateZIndex = useCallback(
  (offsetDistance: number) => {
    if (!enableRollingZIndex) {
      return undefined;
    }
    
    // Simple progress-based z-index
    const normalizedDistance = offsetDistance / 100;
    return Math.floor(zIndexBase + normalizedDistance * zIndexRange);
  },
  [enableRollingZIndex, zIndexBase, zIndexRange]
);

// ...

// Inside an element:
const zIndex = useTransform(
  currentOffsetDistance,
  (value) => calculateZIndex(value)
);
```

## CSS Variable Interpolation

It's also possible to map any CSS property to the path progress using the `cssVariableInterpolation` prop. It accepts an array of objects with `property` and `from` and `to` values. High level example:

### CSS variable interpolation example

```jsx
<MarqueeAlongSvgPath
  path="M0,0 C0,0 100,0 100,100"
  cssVariableInterpolation={[
    { property: "opacity", from: 0, to: 1.5 },
    { property: "scale", from: 0.1, to: 1 },
  ]}
>
  {/* Your content */}
</MarqueeAlongSvgPath>
```

Example:

```tsx
import MarqueeAlongSvgPath from "@/fancy/components/blocks/marquee-along-svg-path"

function generateSpiralPath(turns = 5, centerX = 500, centerY = 137) {
  const points = []
  const numPoints = turns * 300 // number of points to create smooth spiral
  const spacing = 18 // controls how far apart the spiral arms are

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * turns * 2 * Math.PI
    const radius = spacing * angle // radius increases with angle
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`)
  }

  return points.join(" ")
}

const path = generateSpiralPath(4)

export default function MarqueeAlongSvgPathDemo() {
  return (
    <div className="w-dvw h-dvh bg-zinc-50 flex items-center justify-center">
      <h2 className="text-black text-6xl sm:text-8xl z-10">fancy</h2>
      <MarqueeAlongSvgPath
        path={path}
        viewBox="0 0 400 474" // Adjusted to center the spiral
        baseVelocity={1}
        showPath={false}
        slowdownOnHover={true}
        repeat={8}
        enableRollingZIndex={false}
        dragSensitivity={0.01}
        className="absolute top-40 scale-100 -left-32 w-full h-full transform-3d"
        cssVariableInterpolation={[
          { property: "opacity", from: 0, to: 1.5 },
          { property: "scale", from: 0.1, to: 1 },
        ]}
        grabCursor
      >
        {imgs.map((img, i) => (
          <a
            href={img.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto"
          >
            <div
              key={i}
              className="w-14 h-full cursor-pointer transform-3d hover:rotate-y-0 duration-300 ease-in-out hover:rotate-x-0 perspective-midrange -rotate-x-35 rotate-y-35 hover:scale-200"
            >
              <img
                src={img.src}
                alt={`Example ${i}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </a>
        ))}
      </MarqueeAlongSvgPath>
    </div>
  )
}

// EXAMPLE IMAGES
const imgs = [
  {
    src: "https://cdn.cosmos.so/b9909337-7a53-48bc-9672-33fbd0f040a1?format=jpeg",
    link: "https://www.instagram.com/p/DCOl6YTS85e/?igsh=MXNvdHhyczl1djJ6ZA%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/ecdc9dd7-2862-4c28-abb1-dcc0947390f3?format=jpeg",
    link: "https://www.instagram.com/p/C4RTJvVpP4R/?igsh=MWZwOTNlYTVodGszMw%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/79de41ec-baa4-4ac0-a9a4-c090005ca640?format=jpeg",
    link: "https://pangrampangram.com/products/mori",
  },
  {
    src: "https://cdn.cosmos.so/1a18b312-21cd-4484-bce5-9fb7ed1c5e01?format=jpeg",
    link: "https://www.sergidelgado.com/selected-work/ampersand",
  },
  {
    src: "https://cdn.cosmos.so/d765f64f-7a66-462f-8b2d-3d7bc8d7db55?format=jpeg",
    link: "https://www.instagram.com/p/C40XmANsoe_/?igsh=MXFlZGx4cmw3ZW1qYw%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/6b9f08ea-f0c5-471f-a620-71221ff1fb65?format=jpeg",
    link: "https://abduzeedo.com/super-stylish-type-explorations",
  },
  {
    src: "https://cdn.cosmos.so/40a09525-4b00-4666-86f0-3c45f5d77605?format=jpeg",
    link: "https://www.instagram.com/p/CrhdrGjr9yK/?igshid=MTc4MmM1YmI2Ng%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/14f05ab6-b4d0-4605-9007-8a2190a249d0?format=jpeg",
    link: "https://www.instagram.com/julian.stiber/p/By5RBApiDzE/?img_index=1",
  },
  {
    src: "https://cdn.cosmos.so/d05009a2-a2f8-4a4c-a0de-e1b0379dddb8?format=jpeg",
    link: "https://www.instagram.com/p/CeT3COysRNN/?img_index=2",
  },
  {
    src: "https://cdn.cosmos.so/ba646e35-efc2-494a-961b-b40f597e6fc9?format=jpeg",
    link: "https://www.instagram.com/godfreydadich/",
  },
  {
    src: "https://cdn.cosmos.so/e899f9c3-ed48-4899-8c16-fbd5a60705da?format=jpeg",
    link: "https://www.instagram.com/p/Bty1U6BhTOW/?img_index=5",
  },
  {
    src: "https://cdn.cosmos.so/24e83c11-c607-45cd-88fb-5059960b56a0?format=jpeg",
    link: "https://www.instagram.com/p/C48dxn1LqhC/?igsh=dmV5ZWR0Z2Y3Zzlt&img_index=3",
  },
  {
    src: "https://cdn.cosmos.so/cd346bce-f415-4ea7-8060-99c5f7c1741a?format=jpeg",
    link: "https://www.instagram.com/p/C08ZDVyyRhK/?img_index=2&igsh=bHAyZjcxYW1jZDNu",
  },
]

```

## Notes

The component's performance may be impacted by the complexity and length of the SVG path, as well as the number of elements being animated. Keep an eye on it and tweak these factors if you experience performance issues.

## Resources

- [Simple Marquee Component](https://uwuui.com/docs/components/blocks/simple-marquee.md)
- [offset-path by MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path)
- [CSS motion path by MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_motion_path)
- [Motion along path by motion.dev](https://examples.motion.dev/react/motion-path)

## Credits

Click on the individual images in the 2nd demo to see the original artworks & authors.

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `ReactNode` | - | The elements to be scrolled along the path |
| path* | `string` | - | The SVG path string that defines the motion path |
| pathId | `string` | - | Optional ID for the SVG path element |
| preserveAspectRatio | `string` | `"xMidYMid meet"` | SVG preserveAspectRatio attribute value |
| showPath | `boolean` | `false` | Whether to show the SVG path |
| width | `string` | `"100%"` | Width of the SVG container |
| height | `string` | `"100%"` | Height of the SVG container |
| viewBox | `string` | `"0 0 100 100"` | SVG viewBox attribute value |
| baseVelocity | `number` | `5` | Base velocity of the animation |
| direction | `"normal" | "reverse"` | `"normal"` | Direction of the animation along the path |
| easing | `(value: number) => number` | - | Custom easing function for the animation |
| slowdownOnHover | `boolean` | `false` | Whether to slow down on hover |
| slowDownFactor | `number` | `0.3` | Factor to slow down by when hovering |
| slowDownSpringConfig | `SpringOptions` | `{ damping: 50, stiffness: 400 }` | Spring configuration for hover slowdown |
| useScrollVelocity | `boolean` | `false` | Whether to use scroll velocity |
| scrollAwareDirection | `boolean` | `false` | Whether to change direction based on scroll |
| scrollSpringConfig | `SpringOptions` | `{ damping: 50, stiffness: 400 }` | Spring configuration for scroll velocity |
| scrollContainer | `RefObject | HTMLElement | null` | - | Custom scroll container reference |
| repeat | `number` | `3` | Number of times to repeat children |
| draggable | `boolean` | `false` | Whether elements can be dragged |
| dragSensitivity | `number` | `0.2` | Sensitivity of drag movement |
| dragVelocityDecay | `number` | `0.96` | Decay rate of drag velocity |
| dragAwareDirection | `boolean` | `false` | Whether to change direction based on drag |
| grabCursor | `boolean` | `false` | Whether to show grab cursor when draggable |
| enableRollingZIndex | `boolean` | `true` | Whether to enable rolling z-index effect |
| zIndexBase | `number` | `1` | Base z-index value |
| zIndexRange | `number` | `10` | Range of z-index values |
| cssVariableInterpolation | `Array` | `[]` | CSS properties to interpolate along the path |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/blocks/marquee-along-svg-path).*