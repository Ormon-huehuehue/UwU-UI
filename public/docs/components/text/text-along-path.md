# Text Along Path

> A text component that animates along an SVG path.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [text-along-path](#text-along-path)
- [Usage](#usage)
  - [Path ID](#path-id)
  - [Sizing and ViewBox](#sizing-and-viewbox)
- [Understanding the component](#understanding-the-component)
- [Auto animation](#auto-animation)
- [Animation on closed paths](#animation-on-closed-paths)
- [Preserve aspect ratio](#preserve-aspect-ratio)
- [Scroll](#scroll)
- [Notes](#notes)
- [Props](#props)

Example:

```tsx
import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import AnimatedPathText from "@/fancy/components/text/text-along-path"

export default function Preview() {
  // Rounded rectangle path
  const rectPath =
    "M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20"
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle")
  const [email, setEmail] = useState("")

  const buttonCopy = {
    idle: "Subscribe",
    loading: (
      <motion.div className="h-2 w-2 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    ),
    success: "Done ✓",
  } as const

  const handleSubmit = useCallback(() => {
    if (buttonState === "success") return

    setButtonState("loading")

    setTimeout(() => {
      setButtonState("success")
    }, 1750)

    setTimeout(() => {
      setButtonState("idle")
      setEmail("")
    }, 3500)
  }, [buttonState])

  return (
    <div className="w-dvw h-dvh flex justify-center items-center text-[#0015ff] relative bg-white">
      <AnimatedPathText
        path={rectPath}
        svgClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 sm:py-8"
        viewBox="-20 10 240 180"
        text="JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ "
        textClassName="text-[10.6px] lowercase font-azeret-mono text-[#0015ff]"
        duration={20}
        preserveAspectRatio="none"
        textAnchor="start"
      />

      {/* This is just fluff for the demo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-80 p-6 ">
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#0015ff] focus:outline-hidden focus:ring-primary-blue/50 font-azeret-mono text-xs sm:text-base placeholder:text-[#0015ff] rounded-lg bg-white"
          />
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={buttonState === "loading"}
            className="w-full px-3 py-2 h-9 sm:h-11 sm:px-8 sm:py-2 bg-[#0015ff] text-white hover:bg-[#0015ff]/90 transition-colors font-azeret-mono text-xs sm:text-base rounded-lg"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                key={buttonState}
              >
                {buttonCopy[buttonState]}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  )
}

```

## Installation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/text-along-path.json"
```

### Manual

#### text-along-path

```tsx
import { RefObject, useEffect, useRef } from "react"
import { useScroll, UseScrollOptions, useTransform } from "motion/react"

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

type PreserveAspectRatioMeetOrSlice = "meet" | "slice"

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`

interface AnimatedPathTextProps {
  // Path properties
  path: string
  pathId?: string
  pathClassName?: string
  preserveAspectRatio?: PreserveAspectRatio
  showPath?: boolean

  // SVG properties
  width?: string | number
  height?: string | number
  viewBox?: string
  svgClassName?: string

  // Text properties
  text: string
  textClassName?: string
  textAnchor?: "start" | "middle" | "end"

  // Animation properties
  animationType?: "auto" | "scroll"

  // Animation properties if animationType is auto
  duration?: number
  repeatCount?: number | "indefinite"
  easingFunction?: {
    calcMode?: string
    keyTimes?: string
    keySplines?: string
  }

  // Scroll animation properties if animationType is scroll
  scrollContainer?: RefObject<HTMLElement>
  scrollOffset?: UseScrollOptions["offset"]
  scrollTransformValues?: [number, number]
}

const AnimatedPathText = ({
  // Path defaults
  path,
  pathId,
  pathClassName,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  // SVG defaults
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  svgClassName,

  // Text defaults
  text,
  textClassName,
  textAnchor = "start",

  // Animation type
  animationType = "auto",

  // Animation defaults
  duration = 4,
  repeatCount = "indefinite",

  easingFunction = {},

  // Scroll animation defaults
  scrollContainer,
  scrollOffset = ["start end", "end end"],
  scrollTransformValues = [0, 100],
}: AnimatedPathTextProps) => {
  const container = useRef<HTMLDivElement>(null)
  const textPathRefs = useRef<SVGTextPathElement[]>([])

  // naive id for the path. you should rather use yours :)
  const id =
    pathId || `animated-path-${Math.random().toString(36).substring(7)}`

  const { scrollYProgress } = useScroll({
    container: scrollContainer || container,
    offset: scrollOffset,
  })

  const t = useTransform(scrollYProgress, [0, 1], scrollTransformValues)

  useEffect(() => {
    // Re-initialize scroll handler when container ref changes
    const handleChange = (e: number) => {
      textPathRefs.current.forEach((textPath) => {
        if (textPath) {
          textPath.setAttribute("startOffset", `${t.get()}%`)
        }
      })
    }

    scrollYProgress.on("change", handleChange)

    return () => {
      scrollYProgress.clearListeners()
    }
  }, [scrollYProgress, t])

  const animationProps =
    animationType === "auto"
      ? {
          from: "0%",
          to: "100%",
          begin: "0s",
          dur: `${duration}s`,
          repeatCount: repeatCount,
          ...(easingFunction && easingFunction),
        }
      : null

  return (
    <svg
      className={svgClassName}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        id={id}
        className={pathClassName}
        d={path}
        stroke={showPath ? "currentColor" : "none"}
        fill="none"
      />

      {/* First text element */}
      <text textAnchor={textAnchor} fill="currentColor">
        <textPath
          className={textClassName}
          href={`#${id}`}
          startOffset={"0%"}
          ref={(ref) => {
            if (ref) textPathRefs.current[0] = ref
          }}
        >
          {animationType === "auto" && (
            <animate attributeName="startOffset" {...animationProps} />
          )}
          {text}
        </textPath>
      </text>

      {/* Second text element (offset to hide the jump) */}
      {animationType === "auto" && (
        <text textAnchor={textAnchor} fill="currentColor">
          <textPath
            className={textClassName}
            href={`#${id}`}
            startOffset={"-100%"}
            ref={(ref) => {
              if (ref) textPathRefs.current[1] = ref
            }}
          >
            {animationType === "auto" && (
              <animate
                attributeName="startOffset"
                {...animationProps}
                from="-100%"
                to="0%"
              />
            )}
            {text}
          </textPath>
        </text>
      )}
    </svg>
  )
}

export default AnimatedPathText

```

## Usage

There are two types of animations available for this component, which you can control with the `animationType` prop:

1. `auto` — plays the animation automatically when the text is initially rendered. This is the default setting.
2. `scroll` — drives the animation with the scroll position of the container.
   To use this component, you'll need to provide an SVG path via the `path` prop. You can create this path using:

- Design tools like Figma, Illustrator, or any online SVG editor
- Code, by constructing the path programmatically

The component only requires the `d` attribute from your SVG path and the `viewBox` attribute from the SVG container.

### Path ID

Each path needs a unique `id` to properly reference it in the text elements. While the component includes a basic ID generator, it's recommended to provide your own via the `pathId` prop, especially when using multiple instances of the component. This ensures animations remain distinct and don't interfere with each other.

### Sizing and ViewBox

The SVG container can be sized flexibly - by default it will expand to fill its parent container. The `viewBox` attribute can be any dimensions, but it's recommended to:

1. Match the aspect ratio you want the final component to have
2. Use dimensions that make sense for your path coordinates

For example, if your path coordinates span 0-500 on x and 0-100 on y, a viewBox of "0 0 500 100" would be appropriate.

## Understanding the component

The component consist an svg container with a path element, and two text elements with `textPath` elements inside. The `textPath` elements are used to animate the text along the path. When it is used with the `auto` animation type, we use an `animate` element to animate the text along the path. When it is used with the `scroll` animation type, we animate the `startOffset` attribute of the `textPath` elements to scroll the text along the path.

## Auto animation

The `auto` animation type is the default setting, and it plays the animation automatically when the text is initially rendered. We start at 0% offset and animate to 100% offset, which means the text will start at the beginning of the path and end at the end of the path.

The relevant props for the `auto` animation type are:

- `duration` — the duration of the animation in milliseconds
- `repeatCount` — the number of times the animation should repeat. You can also set this to `indefinite` to make the animation repeat indefinitely (default setting)

Example:

```tsx
import React, { useRef } from "react"

import AnimatedPathText from "@/fancy/components/text/text-along-path"

export default function TextAlongPathAutoDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  const paths = [
    "M1 248C214 -47 582 158 679 -39",
    "M1 208C214 -87 582 118 679 -79",
    "M1 168C214 -127 582 78 679 -119",
  ]

  const texts = [
    `PARIS • LONDON • BERLIN • ROME • BARCELONA • MADRID • VIENNA • PRAGUE • AMSTERDAM • STOCKHOLM`,
    `BUDAPEST • COPENHAGEN • OSLO • HELSINKI • MILAN • MUNICH • VENICE • MADRID • VIENNA • PRAGUE`,
    `PARIS • BERLIN • ROME • BARCELONA • MADRID • VIENNA • PRAGUE • AMSTERDAM`,
  ]

  return (
    <div
      className="w-dvw h-dvh overflow-hidden relative bg-white"
      ref={containerRef}
    >
      <div className="absolute w-full h-full flex flex-col">
        {paths.map((path, i) => (
          <AnimatedPathText
            key={`auto-path-${i}`}
            path={path}
            pathId={`auto-path-${i}`}
            svgClassName={`absolute -left-[100px] top-1/3 w-[calc(100%+200px)] h-full`}
            viewBox="0 0 680 250"
            text={texts[i]}
            textClassName={`text font-thin text-gray-800`}
            animationType="auto"
            duration={i * 0.5 + 5}
            textAnchor="start"
          />
        ))}
      </div>
    </div>
  )
}

```

## Animation on closed paths

You might notice the component uses two identical text elements with `textPath` elements when you use the `auto` animation type. The reason for this to achieve the illusion of continuous movement on a closed path. Here is how it works:

1. The first text element starts at the beginning of the path and animates forward
2. The second text element follows behind the first one at an offset
3. When the first text reaches the end of the path, the second text has moved into position to continue the animation
4. This creates the illusion of continuous movement without any visible jumps or gaps

This dual-text approach is necessary because animating a single text element would result in a noticeable "jump" when the animation resets back to the start position.

See an example of this in the first, and the following demo above:

Example:

```tsx
import { cn } from "@/lib/utils"
import AnimatedPathText from "@/fancy/components/text/text-along-path"

export default function Preview() {
  const circlePath =
    "M 100 100 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"

  return (
    <div className="w-dvw h-dvh flex justify-center items-center relative ">
      {[0, 90, 180, 270].map((rotation, i) => (
        <AnimatedPathText
          key={rotation}
          path={circlePath}
          pathId={`circle-path-${i}`}
          svgClassName={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ",
            {
              "rotate-0": rotation === 0,
              "rotate-90": rotation === 90,
              "rotate-180": rotation === 180,
              "-rotate-90": rotation === 270,
            }
          )}
          easingFunction={{
            calcMode: "spline",
            keyTimes: "0;1",
            keySplines: "0.762 0.002 0.253 0.999",
          }}
          viewBox="0 0 200 200"
          text="loading"
          textClassName="text-[15px]"
          duration={2.5}
          textAnchor="start"
        />
      ))}
    </div>
  )
}

```

This example above also demonstrates how to use the `easingFunction` prop to create more interesting animations. Please refer to the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function) on what values you can use.

Another important note here is that you have to experiment with the text length and size, to ensure the text doesn't overlap with each other, since it's not calculated automatically.

## Preserve aspect ratio

The `preserveAspectRatio` attribute controls how the SVG content scales to fit its container when their aspect ratios differ. This is determined by comparing the `viewBox` dimensions to the actual SVG container size. For example, with `preserveAspectRatio="xMidYMid meet"`, the path and text will be centered both horizontally and vertically while maintaining proportions.

Please refer to the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio) for the poossible values. In short, the default value `xMidYMid meet` will work for most cases. If you set it to `none`, the SVG container will be stretched to the container size, but will also result in a distortion of the text. Check out this behaviour on the first demo. Resize your viewport to see the difference.

## Scroll

By setting the `animationType` prop to `scroll`, you can control the animation with the scroll position of the container. For tracking the scroll position, we use the `useScroll` hook from `motion/react`.

The relevant props are:

- `scrollContainer` — a ref to the container element that the scroll animation will be driven by
- `scrollOffset` — the scroll offset range for the animation
- `scrollTransformValues` — The `scrollYProgress` value returned by `useScroll` hook ranges between 0 and 1, and this prop defines how we should map these values to the `startOffset` attribute of the text elements. It will be converted to percentage values.

Please refer to the [motion docs](https://motion.dev/docs/react-scroll-animations) for more details.

Example:

```tsx
import { useState } from "react"

import AnimatedPathText from "@/fancy/components/text/text-along-path"

export default function Preview() {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const paths = [
    "M1 254C177 219 61 -64 269 15C477 94 332 285 214 348C96 411 155 546 331 486C507 426 410 267 667 215C872.6 173.4 951.333 264.333 965 315",
    "M1 214C177 179 61 -104 269 -25C477 54 332 245 214 308C96 371 155 506 331 446C507 386 410 227 667 175C872.6 133.4 951.333 224.333 965 275",
    "M1 294C177 259 61 -24 269 55C477 134 332 325 214 388C96 451 155 586 331 526C507 466 410 307 667 255C872.6 213.4 951.333 304.333 965 355",
    "M1 174C177 139 61 -144 269 -65C477 14 332 205 214 268C96 331 155 466 331 406C507 346 410 187 667 135C872.6 93.4 951.333 184.333 965 235",
    "M1 334C177 299 61 16 269 95C477 174 332 365 214 428C96 491 155 626 331 566C507 506 410 347 667 295C872.6 253.4 951.333 344.333 965 395",
    "M1 134C177 99 61 -184 269 -105C477 -26 332 165 214 228C96 291 155 426 331 366C507 306 410 147 667 95C872.6 53.4 951.333 144.333 965 195",
    "M1 374C177 339 61 56 269 135C477 214 332 405 214 468C96 531 155 666 331 606C507 546 410 387 667 335C872.6 293.4 951.333 384.333 965 435",
    "M1 94C177 59 61 -224 269 -145C477 -66 332 125 214 188C96 251 155 386 331 326C507 266 410 107 667 55C872.6 13.4 951.333 104.333 965 155",
  ]

  // Fun text phrases for each path
  const texts = [
    "Information is expanding daily. How to get it out visually is important.",
    "The details are not the details. They make the design.",
    "There's no other product that changes function like the computer.",
    "Innovation is the outcome of a habit, not a random act.",
    "The only important thing about design is how it relates to people.",
    "Good design is obvious. Great design is transparent.",
  ]

  return (
    <div
      className="w-dvw h-dvh overflow-auto relative font-calendas"
      ref={(node) => setContainer(node)}
    >
      <div className="h-[200%] absolute top-0 left-0 w-full flex flex-col items-center mt-40 text-4xl">
        <p>SCROLL DOWN</p>
      </div>
      <div className="sticky w-full top-0  h-full flex flex-col">
        {paths.map((path, i) => (
          <AnimatedPathText
            key={`path-${i}`}
            path={path}
            // showPath
            scrollContainer={{ current: container }}
            pathId={`flowing-path-${i}`}
            svgClassName={`absolute -left-[100px] top-0 w-[calc(100%+200px)] h-full`}
            viewBox="0 0 900 600"
            text={texts[i]}
            textClassName={`text-xl font-thin font-calendas`}
            animationType="scroll"
            scrollTransformValues={[-130, 95]}
            textAnchor="start"
          />
        ))}
      </div>
    </div>
  )
}

```

## Notes

The performance impact of the animation increases with the length and complexity of the path, especially if you're using multiple instances, so keep an eye on it :).

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| path* | `string` | - | The path to be animated |
| text* | `string` | - | The text to be animated |
| pathId | `string` | - | The ID for the path |
| pathClassName | `string` | - | Additional CSS classes for the path |
| preserveAspectRatio | `PerserveAspectRatio` | `"xMidYMid meet"` | The aspect ratio to preserve when scaling the SVG |
| showPath | `boolean` | `false` | Whether to show the path |
| width | `string | number` | `100%` | The width of the SVG container |
| height | `string | number` | `100%` | The height of the SVG container |
| viewBox | `string` | `"0 0 100 100"` | The viewBox of the SVG container |
| svgClassName | `string` | - | Additional CSS classes for the SVG container |
| textClassName | `string` | - | Additional CSS classes for the text |
| textAnchor | `"start" | "middle" | "end"` | `"start"` | The text anchor of the text |
| animationType | `"auto" | "scroll"` | `"auto"` | The animation type |
| duration | `number` | `4` | The duration of the animation in milliseconds |
| repeatCount | `number | "indefinite"` | `"indefinite"` | The number of times the animation should repeat |
| easingFunction | `{ calcMode?: string; keyTimes?: string; keySplines?: string }` | - | The easing function for the animation |
| scrollContainer | `RefObject` | - | The ref to the container element that the scroll animation will be driven by |
| scrollOffset | `UseScrollOptions["offset"]` | `["start end", "end end"]` | The scroll offset range for the animation |
| scrollTransformValues | `[number, number]` | `[0, 100]` | The scrollYProgress value returned by `useScroll` hook ranges between 0 and 1, and this prop defines how we should map these values to the `startOffset` attribute of the text elements. It will be converted to percentage values. |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/text-along-path).*