# Pixelate SVG Filter

> A filter component that applies a pixelation effect with an SVG filter. Safari is not supported.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [pixelate-svg-filter](#pixelate-svg-filter)
- [Usage](#usage)
  - [Pixelate SVG Filter Example](#pixelate-svg-filter-example)
- [Understanding the component](#understanding-the-component)
- [Examples](#examples)
  - [Text](#text)
- [Notes](#notes)
- [Props](#props)
- [Credits](#credits)

Example:

```tsx
import { useRef } from "react"
import PixelateSvgFilter from "@/fancy/components/filter/pixelate-svg-filter"
import { useMousePosition } from "@/hooks/use-mouse-position"

export default function PixelateSVGFilterDemo() {
    const containerRef = useRef<HTMLDivElement>(null)
    const mousePosition = useMousePosition(containerRef)
    const pixelSize = Math.min(Math.max(mousePosition.x / 30, 1), 64)

  return (
    <div className="relative flex flex-col items-center justify-center w-dvw h-dvh gap-4 bg-black" ref={containerRef}>
      <PixelateSvgFilter id="pixelate-filter" size={pixelSize} crossLayers />
      <div 
        id="image-container"
        className="w-1/2 md:w-1/3 h-1/2 overflow-hidden relative text-white"
        style={{ filter: "url(#pixelate-filter)" }}
      >
        <video
          src={"https://cdn.cosmos.so/96ae0b34-289d-489d-94a1-c68925ddd3a9.mp4"}
          className="w-full h-full object-cover absolute inset-0"
          autoPlay
          muted
          playsInline
          loop
          //style={{ filter: "url(#pixelate-filter)" }}

        />
      </div>
      
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/pixelate-svg-filter.json"
```

### Manual

#### pixelate-svg-filter

```tsx
interface PixelateSvgFilterProps {
  id: string
  size?: number
  crossLayers?: boolean
}

export default function PixelateSvgFilter({
  id = "pixelate-filter",
  size = 16,
  crossLayers = false,
}: PixelateSvgFilterProps) {
  return (
    <svg className="absolute inset-0">
      <defs>
        <filter id={id} x="0" y="0" width="1" height="1">
          {"First layer: Normal pixelation effect"}
          <feConvolveMatrix
            kernelMatrix="1 1 1
                          1 1 1
                          1 1 1"
            result="AVG"
          />
          <feFlood x="1" y="1" width="1" height="1" />
          <feComposite
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            width={size}
            height={size}
          />
          <feTile result="TILE" />
          <feComposite
            in="AVG"
            in2="TILE"
            operator="in"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
          />
          <feMorphology operator="dilate" radius={size / 2} result={"NORMAL"} />
          {crossLayers && (
            <>
              {"Second layer: Fallback with full-width tiling"}
              <feConvolveMatrix
                kernelMatrix="1 1 1
                              1 1 1
                              1 1 1"
                result="AVG"
              />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
                width={size / 2}
                height={size}
              />
              <feTile result="TILE" />
              <feComposite
                in="AVG"
                in2="TILE"
                operator="in"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
              />
              <feMorphology
                operator="dilate"
                radius={size / 2}
                result={"FALLBACKX"}
              />
              {"Third layer: Fallback with full-height tiling"}
              <feConvolveMatrix
                kernelMatrix="1 1 1
                              1 1 1
                              1 1 1"
                result="AVG"
              />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
                width={size}
                height={size / 2}
              />
              <feTile result="TILE" />
              <feComposite
                in="AVG"
                in2="TILE"
                operator="in"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
              />
              <feMorphology
                operator="dilate"
                radius={size / 2}
                result={"FALLBACKY"}
              />
              <feMerge>
                <feMergeNode in="FALLBACKX" />
                <feMergeNode in="FALLBACKY" />
                <feMergeNode in="NORMAL" />
              </feMerge>
            </>
          )}
          {!crossLayers && <feMergeNode in="NORMAL" />}
        </filter>
      </defs>
    </svg>
  )
}

```

## Usage

Add the `PixelateSvgFilter` component to your project, pass an `id` prop to the component (optional), then use the same `id` prop in the `filter` CSS property of the container you want to apply the filter to. High-level example:

### Pixelate SVG Filter Example

```tsx
<PixelateSvgFilter id="pixelate-filter" />
<div style={{ filter: "url(#pixelate-filter)" }}>
 filter will be applied here
</div>
```

## Understanding the component

The pixelation effect is achieved using SVG filters. The process works in three steps:

1. The filter divides the input into a grid using `feFlood` and `feComposite` operations, where each cell represents a future "pixel"
2. The `feTile` operation repeats this grid pattern across the entire target area
3. Finally, `feColorMatrix` and `feComposite` are used to blend the original image with the grid, creating the pixelated effect

The component accepts two optional props to customize the pixelation effect:

- `size` (default: 16): Controls the size of each "pixel" in the resulting effect. A larger value creates a more blocky appearance, while a smaller value produces finer pixelation.

- `crossLayers` (default: false): When enabled, adds two additional filter layers that help prevent visual artifacts:
  - A second layer that ensures full-width coverage by using half-width pixels
  - A third layer that ensures full-height coverage by using half-height pixels
  
  This is particularly useful when applying dynamic filters where the target area's dimensions may not perfectly align with the pixel grid, preventing unwanted "jumpiness" in the effect.

Please have a look at the following [thread](https://stackoverflow.com/questions/37451189/can-one-pixelate-images-with-an-svg-filter) for more details. Props to the folks who shared their insights and code!

## Examples

### Text

The filter can be applied to text as well. Hit the refresh button to see the effect.

Example:

```tsx
import { useEffect, useRef, useState } from "react"
import { animate, useMotionValue, useMotionValueEvent } from "motion/react"

import PixelateSvgFilter from "@/fancy/components/filter/pixelate-svg-filter"

export default function PixelateSVGFilterDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pixelSize = useMotionValue(16)
  const [size, setSize] = useState(16)
  const [isAnimating, setIsAnimating] = useState(true)

  useMotionValueEvent(pixelSize, "change", (latest) => {
    setSize(latest)
  })

  useEffect(() => {
    const controls = animate(pixelSize, 1, {
      duration: 1.2,
      ease: "easeOut",
      onComplete: () => setIsAnimating(false),
    })

    return controls.stop
  }, [])

  return (
    <div
      className="relative flex flex-col md:flex-row w-dvw h-dvh bg-background p-4 sm:p-8 md:p-12"
      ref={containerRef}
    >
      {isAnimating && (
        <PixelateSvgFilter id="pixelate-text-filter" size={size} />
      )}

      {/* Left Content */}
      <div
        className="flex-1 mb-8 md:mb-0"
        style={{
          filter: isAnimating ? "url(#pixelate-text-filter)" : undefined,
        }}
      >
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl mb-1">Ari — Yu</h1>
          <a
            href="mailto:hello@arianexus.io"
            className="text-muted-foreground text-xs sm:text-sm"
          >
            hello@ariyu.co
          </a>
        </div>

        <div className="mb-12 sm:mb-16 md:mb-24">
          <h2 className="text-base sm:text-lg font-bold">Creative Director</h2>
          <h2 className="text-base sm:text-lg font-bold">& Writer</h2>
        </div>

        <div className="w-full md:w-1/2">
          <h3 className="text-sm sm:text-base font-medium mb-2">
            Selected Works
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Dreamweaver #93 Dec 2023 Starlight #87 "digital dreams" The Quantum
            Mirror Press Holograph Vol.5 crystal edition 2020 Byte Flow Vol.12
            Neural Canvas #9 Synthmagazin 11/2020 VOID 2020 zine Nebula #4 VOID
            量子 + Wave zines Binary Pulse volume 7 Cyber Cascade
            (self-published)
          </p>
        </div>
      </div>

      {/* Right Content - Image */}
      <div className="hidden md:block md:w-36 md:h-36 relative mx-auto md:mr-12">
        <img
          className="w-full h-full object-cover absolute inset-0"
          src={
            "https://images.unsplash.com/photo-1729009704569-474ddd86ed3a?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          style={{
            filter: isAnimating ? "url(#pixelate-text-filter)" : undefined,
          }}
        />
      </div>
    </div>
  )
}

```

## Notes

Safari is unfortunately not supported. If you have any suggestions or ideas for how to make this component work with it, please let us know!

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| id | `string` | `"pixelate-filter"` | The ID of the filter |
| size | `number` | `16` | The size of each pixel in the resulting effect |
| crossLayers | `boolean` | `false` | Whether to add two additional filter layers |

## Credits

The effect is derived from multiple people's work from this [thread](https://stackoverflow.com/questions/37451189/can-one-pixelate-images-with-an-svg-filter).

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/filter/pixelate-svg-filter).*