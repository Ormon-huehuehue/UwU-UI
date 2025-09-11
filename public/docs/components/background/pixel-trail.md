# Pixel Trail

> A pixelated trail effect that recolors grid pixels as you move your cursor.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [pixel-trail](#pixel-trail)
- [Usage](#usage)
- [Examples](#examples)
  - [Without fading](#without-fading)
  - [Customizing the pixels](#customizing-the-pixels)
  - [Combining with SVG Filters](#combining-with-svg-filters)
- [Notes](#notes)
- [Credits](#credits)
- [Props](#props)

Example:

```tsx
import useScreenSize from "@/hooks/use-screen-size"
import PixelTrail from "@/fancy/components/background/pixel-trail"

const PixelTrailDemo: React.FC = () => {
  const screenSize = useScreenSize()

  return (
    <div className="w-dvw h-dvh bg-black text-white flex flex-col font-azeret-mono">
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 16 : 24}
          fadeDuration={500}
          pixelClassName="bg-white"
        />
      </div>

      <div className="justify-center items-center flex flex-col w-full h-full">
        <h2 className="font-tiny5 text-3xl sm:text-4xl md:text-6xl uppercase">
          FANCYCOMPONENTS.DEV
        </h2>
        <p className="pt-0.5 sm:pt-2 text-xs sm:text-base md:text-xl">
          Make the web fun again.
        </p>
      </div>
    </div>
  )
}

export default PixelTrailDemo

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/pixel-trail.json"
```

### Manual

Install the `uuid` package:

```bash
@types/uuid uuid
```

We use the uuid package to generate a unique ID for each trail instance — so each trail will work without interfering with other effects.

Then, copy and paste the component source code into your project:

#### pixel-trail

```tsx
"use client"

import React, { useCallback, useMemo, useRef } from "react"
import { motion, useAnimationControls } from "motion/react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"

interface PixelTrailProps {
  pixelSize: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const trailId = useRef(uuidv4())

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / pixelSize)
      const y = Math.floor((e.clientY - rect.top) / pixelSize)

      const pixelElement = document.getElementById(
        `${trailId.current}-pixel-${x}-${y}`
      )
      if (pixelElement) {
        const animatePixel = (pixelElement as any).__animatePixel
        if (animatePixel) animatePixel()
      }
    },
    [pixelSize]
  )

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default PixelTrail

interface PixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, size, fadeDuration, delay, className }) => {
    const controls = useAnimationControls()

    const animatePixel = useCallback(() => {
      controls.start({
        opacity: [1, 0],
        transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
      })
    }, [])

    // Attach the animatePixel function to the DOM element
    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          ;(node as any).__animatePixel = animatePixel
        }
      },
      [animatePixel]
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("cursor-pointer-none", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    )
  }
)

PixelDot.displayName = "PixelDot"

```

## Usage

Just drop the `PixelTrail` component into your project, define a pixelSize, and pass the `pixelColor` prop. You can also pass a `className` prop to style the container, and a `pixelClassName` prop to style the individual pixels.

## Examples

### Without fading

If you set the `fadeDuration` prop to `0`, and increase the `delay` prop, you can create a trail effect that doesn't fade.

Example:

```tsx
import Image from "next/image"

import PixelTrail from "@/fancy/components/background/pixel-trail"

const PixelTrailDemo: React.FC = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=2838&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="water surface"
        fill
        className="absolute inset-0 z-0 contrast-[70%]"
      />
      <div className="absolute inset-0 z-1">
        <PixelTrail
          pixelSize={20}
          delay={130}
          fadeDuration={0}
          pixelClassName="bg-[#f1ff76]"
        />
      </div>

      <ul className="flex w-full items-center font-bold space-x-6 px-6 py-4 text-[#f1ff76] z-10 justify-between text-2xl md:text-4xl">
        <a>WATER SUPPLY CO.</a>
        <a
          href=""
          className="hover:underline cursor-pointer  font-bold uppercase text-[#f1ff76]"
        >
          Menu
        </a>
      </ul>
      <div className="z-0 text-[#f1ff76] text-6xl mt-12 mx-6">
        <div className="flex flex-row items-center">
          <h2 className="font-tiny5 text-6xl md:text-9xl uppercase">100%</h2>
          <h2 className="text-5xl md:text-8xl ml-4 md:ml-8">purity</h2>
        </div>
        <p className="mt-3 text-base md:text-3xl">
          {
            "we deliver more than just hydration — we offer nature's purest refreshment, untouched by modern contaminants. Our water is sourced from deep, protected aquifers and naturally filtered through ancient rock layers, with unmatched clarity and taste."
          }
        </p>
      </div>
    </div>
  )
}

export default PixelTrailDemo

```

### Customizing the pixels

You can customize the individual pixels by passing a `pixelClassName` prop.

Example:

```tsx
import useScreenSize from "@/hooks/use-screen-size"
import PixelTrail from "@/fancy/components/background/pixel-trail"

const PixelTrailDemo: React.FC = () => {
  const screenSize = useScreenSize()

  return (
    <div className="relative w-dvw h-dvh bg-white text-black flex flex-col font-calendas">
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 14 : 20}
          fadeDuration={0}
          delay={600}
          pixelClassName="rounded-full bg-"
        />
      </div>

      <div className="justify-center items-center flex flex-col w-full h-full z-10 pointer-events-none space-y-2 md:space-y-4">
        <h2 className="text-xl cursor-pointer sm:text-3xl md:text-5xl tracking-tight">
          fancy ✽ components{" "}
        </h2>
        <p className="text-xs md:text-lg font-overused-grotesk">
          with react, motion, and typrscript.
        </p>
      </div>
    </div>
  )
}

export default PixelTrailDemo

```

### Combining with SVG Filters

The following example combines the [GooeyFilter](https://uwuui.com/docs/components/filter/gooey-filter.md) component with the PixelTrail component to create a fluid interface. Unfortunately, the component doesn't support Safari, so you'll need to create a fallback for that.

Example:

```tsx
import useDetectBrowser from "@/hooks/use-detect-browser"
import useScreenSize from "@/hooks/use-screen-size"
import PixelTrail from "@/fancy/components/background/pixel-trail"
import GooeySvgFilter from "@/fancy/components/filter/gooey-svg-filter"

export default function GooeyDemo() {
  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === "Safari"

  return (
    <div className="relative w-dvw h-dvh flex flex-col items-center justify-center gap-8 bg-black text-center text-pretty">
      <img
        src="https://images.aiscribbles.com/34fe5695dbc942628e3cad9744e8ae13.png?v=60d084"
        alt="impressionist painting"
        className="w-full h-full object-cover absolute inset-0 opacity-70"
      />

      <GooeySvgFilter id="gooey-filter-pixel-trail" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: isSafari ? "none" : "url(#gooey-filter-pixel-trail)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 24 : 32}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-white"
        />
      </div>

      <p className="text-white text-4xl sm:text-5xl md:text-7xl z-10 font-calendas w-1/2 font-bold">
        Speaking things into existence
        <span className="font-overused-grotesk"></span>
      </p>
    </div>
  )
}

```

## Notes

1. The component operates by dividing the container into a grid of pixels and dynamically recoloring them as you move your cursor. Each pixel is represented by a single div element, so perf may be impacted when using a large number of pixels, especially on the first render.

2. Keep the z-index of the effect's container lower than the rest of your content, so the pointer-events will captured by all of your other elements.

## Credits

Ported to Framer by [Framer University](https://framer.university/)

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| pixelSize | `number` | `20` | Size of each pixel in pixels |
| fadeDuration | `number` | `500` | Duration of the fade animation in milliseconds |
| delay | `number` | `0` | Delay before the fade animation starts in milliseconds |
| className | `string` | - | Additional CSS classes for styling |
| pixelClassName | `string` | - | Additional CSS classes for styling the individual pixels |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/background/pixel-trail).*