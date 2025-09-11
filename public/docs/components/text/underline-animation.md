# Underline Animation

> A component that animates a text underline.

## Table of Contents

- [Installation](#installation)
  - [From center](#from-center)
  - [Cli](#cli)
  - [Manual](#manual)
    - [underline-center](#underline-center)
  - [From side to side (comes in, goes out)](#from-side-to-side-comes-in-goes-out)
  - [Cli](#cli)
  - [Manual](#manual)
    - [underline-comes-in-goes-out](#underline-comes-in-goes-out)
  - [From side to side (goes out, comes in)](#from-side-to-side-goes-out-comes-in)
  - [Cli](#cli)
  - [Manual](#manual)
    - [underline-goes-out-comes-in](#underline-goes-out-comes-in)
- [Understanding the component](#understanding-the-component)
- [Props](#props)

Example:

```tsx
import Link from "next/link"

import CenterUnderline from "@/fancy/components/text/underline-center"
import ComesInGoesOutUnderline from "@/fancy/components/text/underline-comes-in-goes-out"
import GoesOutComesInUnderline from "@/fancy/components/text/underline-goes-out-comes-in"

export default function UnderlineDemo() {
  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center bg-white">
      <div className="flex flex-row font-overused-grotesk items-start text-[#0015ff] h-full py-36 uppercase space-x-8 text-sm sm:text-lg md:text-xl lg:text-2xl">
        <div>Contact</div>
        <ul className="flex flex-col space-y-1 h-full">
          <Link className="" href="#">
            <CenterUnderline>LINKEDIN</CenterUnderline>
          </Link>
          <Link className="" href="#">
            <ComesInGoesOutUnderline direction="right">
              INSTAGRAM
            </ComesInGoesOutUnderline>
          </Link>
          <Link className="" href="#">
            <ComesInGoesOutUnderline direction="left">
              X (TWITTER)
            </ComesInGoesOutUnderline>
          </Link>

          <div className="pt-12">
            <ul className="flex flex-col space-y-1 h-full">
              <Link className="" href="#">
                <GoesOutComesInUnderline direction="left">
                  FANCY@FANCY.DEV
                </GoesOutComesInUnderline>
              </Link>
              <Link className="" href="#">
                <GoesOutComesInUnderline direction="right">
                  HELLO@FANCY.DEV
                </GoesOutComesInUnderline>
              </Link>
            </ul>
          </div>
        </ul>
      </div>
    </div>
  )
}

```

## Installation

### From center

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/underline-center.json"
```

### Manual

#### underline-center

```tsx
"use client"

import { ElementType, useEffect, useRef, useMemo } from "react"
import { motion, ValueAnimationTransition } from "motion/react"
import { cn } from "@/lib/utils"

interface UnderlineProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Animation transition configuration
   * @default { duration: 0.25, ease: "easeInOut" }
   */
  transition?: ValueAnimationTransition

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number
}

const CenterUnderline = ({
  children,
  as,
  className,
  transition = { duration: 0.25, ease: "easeInOut" },
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  ...props
}: UnderlineProps) => {
  const textRef = useRef<HTMLSpanElement>(null)
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
        const underlineHeight = fontSize * underlineHeightRatio
        const underlinePadding = fontSize * underlinePaddingRatio
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`
        )
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`
        )
      }
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles)
  }, [underlineHeightRatio, underlinePaddingRatio])

  const underlineVariants = {
    hidden: {
      width: 0,
      originX: 0.5,
    },
    visible: {
      width: "100%",
      transition: transition,
    },
  }

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      whileHover="visible"
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.div
        className="absolute left-1/2 bg-current -translate-x-1/2"
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
    </MotionComponent>
  )
}

CenterUnderline.displayName = "CenterUnderline"

export default CenterUnderline

```

### From side to side (comes in, goes out)

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/underline-comes-in-goes-out.json"
```

### Manual

#### underline-comes-in-goes-out

```tsx
"use client"

import { ElementType, useEffect, useRef, useState, useMemo } from "react"
import cn from "clsx"
import {
  motion,
  useAnimationControls,
  ValueAnimationTransition,
} from "motion/react"

interface ComesInGoesOutUnderlineProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType

  /**
   * Direction of the animation
   * @default "left"
   */
  direction?: "left" | "right"

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number

  /**
   * Animation transition configuration
   * @default { duration: 0.4, ease: "easeInOut" }
   */
  transition?: ValueAnimationTransition
}

const ComesInGoesOutUnderline = ({
  children,
  as,
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = {
    duration: 0.4,
    ease: "easeInOut",
  },
  ...props
}: ComesInGoesOutUnderlineProps) => {
  const controls = useAnimationControls()
  const [blocked, setBlocked] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
        const underlineHeight = fontSize * underlineHeightRatio
        const underlinePadding = fontSize * underlinePaddingRatio
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`
        )
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`
        )
      }
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles)
  }, [underlineHeightRatio, underlinePaddingRatio])

  const animate = async () => {
    if (blocked) return

    setBlocked(true)

    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    })

    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    })

    setBlocked(false)
  }

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className={cn("absolute bg-current w-0", {
          "left-0": direction === "left",
          "right-0": direction === "right",
        })}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(1 * var(--underline-padding))",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  )
}

ComesInGoesOutUnderline.displayName = "ComesInGoesOutUnderline"

export default ComesInGoesOutUnderline

```

### From side to side (goes out, comes in)

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/underline-goes-out-comes-in.json"
```

### Manual

#### underline-goes-out-comes-in

```tsx
"use client"

import { ElementType, useEffect, useRef, useState, useMemo } from "react"
import cn from "clsx"
import {
  motion,
  useAnimationControls,
  ValueAnimationTransition,
} from "motion/react"

interface GoesOutComesInUnderlineProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType

  /**
   * Direction of the animation
   * @default "left"
   */
  direction?: "left" | "right"

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number

  /**
   * Animation transition configuration
   * @default { duration: 0.5, ease: "easeOut" }
   */
  transition?: ValueAnimationTransition
}

const GoesOutComesInUnderline = ({
  children,
  as,
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = {
    duration: 0.5,
    ease: "easeOut",
  },
  ...props
}: GoesOutComesInUnderlineProps) => {
  const controls = useAnimationControls()
  const [blocked, setBlocked] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
        const underlineHeight = fontSize * underlineHeightRatio
        const underlinePadding = fontSize * underlinePaddingRatio
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`
        )
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`
        )
      }
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles)
  }, [underlineHeightRatio, underlinePaddingRatio])

  const animate = async () => {
    if (blocked) return

    setBlocked(true)

    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    })

    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    })

    setBlocked(false)
  }

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className={cn("absolute bg-current", {
          "left-0": direction === "left",
          "right-0": direction === "right",
        })}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
          width: "100%",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  )
}

GoesOutComesInUnderline.displayName = "GoesOutComesInUnderline"

export default GoesOutComesInUnderline

```

## Understanding the component

These underline animations work differently from typical CSS underline animations. Instead of animating the CSS `text-decoration-line: underline` property, they create a separate `div` element positioned absolutely below the text. This div acts as the underline and its dimensions are calculated relative to the font size:

- The height is controlled by `underlineHeightRatio` (defaults to 10% of font size)
- The padding below text is controlled by `underlinePaddingRatio` (defaults to 1% of font size)

The three variants work as follows:

- **Center**: The underline grows outward from the center point
- **Comes In Goes Out**: The underline enters from one side, then exits from the other side
- **Goes Out Comes In**: The underline exits from one side, then re-enters from the opposite side

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| children* | `React.ReactNode` | - | The content to be displayed and underlined |
| as | `ElementType` | `"span"` | The HTML element to render the component as |
| direction (only for side-to-side variants) | `"left" | "right"` | `"left"` | The direction of the underline animation |
| className | `string` | `undefined` | Additional CSS classes for styling |
| onClick | `() => void` | `undefined` | Callback function when the text is clicked |
| underlineHeightRatio | `number` | `0.1` | Height of the underline as a ratio of the font size |
| underlinePaddingRatio | `number` | `0.01` | Padding below the text as a ratio of the font size |
| transition | `ValueAnimationTransition` | Varies by variant | Animation configuration, refer to motion docs for more details |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/underline-animation).*