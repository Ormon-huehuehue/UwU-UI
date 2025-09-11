# Letter Swap

> A text component that swaps the letters vertically on hover.

## Table of Contents

- [Installation](#installation)
  - [Only forward animation](#only-forward-animation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [letter-swap-forward-anim](#letter-swap-forward-anim)
  - [Ping Pong animation](#ping-pong-animation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [letter-swap-pingpong-anim](#letter-swap-pingpong-anim)
- [Understanding the component](#understanding-the-component)
  - [Stagger](#stagger)
  - [Line swap](#line-swap)
- [Props](#props)

Example:

```tsx
import LetterSwapForward from "@/fancy/components/text/letter-swap-forward-anim"
import LetterSwapPingPong from "@/fancy/components/text/letter-swap-pingpong-anim"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh rounded-lg bg-white text-xl md:text-3xl  flex flex-col items-center justify-center font-calendas">
      <div className=" p-12 text-[#0015ff] rounded-xl align-text-top  gap-y-1 md:gap-y-2 flex flex-col">
        <LetterSwapForward
          label="Hover me chief!"
          reverse={true}
          className="italic"
        />
        <LetterSwapForward
          label="{awesome}"
          reverse={false}
          className="font-bold"
        />
        <LetterSwapForward
          label="Good day!"
          staggerFrom={"center"}
          className="mono"
        />
        <LetterSwapPingPong
          label="More text?"
          staggerFrom={"center"}
          reverse={false}
          className="font-overused-grotesk font-bold"
        />
        <LetterSwapPingPong label="oh, seriously?!" staggerFrom={"last"} />
      </div>
    </div>
  )
}

```

There are two types of animations available for this component:

1. Forward animation — plays the animation timeline once forward, when you hover over the text.
2. Ping Pong animation — plays the animation timeline in a ping pong fashion. It plays once forward when you hover over the text, and once in the opposite direction when you hover away from the text.

## Installation

### Only forward animation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/letter-swap-forward-anim.json"
```

### Manual

#### letter-swap-forward-anim

```tsx
"use client"

import { useState } from "react"
import { AnimationOptions, motion, stagger, useAnimate } from "motion/react"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
}

const LetterSwapForward = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const hoverStart = () => {
    if (blocked) return

    setBlocked(true)

    // Function to merge user transition with stagger and delay
    const mergeTransition = (baseTransition: AnimationOptions) => ({
      ...baseTransition,
      delay: stagger(staggerDuration, {
        from: staggerFrom,
      }),
    })

    animate(
      ".letter",
      { y: reverse ? "100%" : "-100%" },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter",
        {
          y: 0,
        },
        {
          duration: 0,
        }
      ).then(() => {
        setBlocked(false)
      })
    })

    animate(
      ".letter-secondary",
      {
        top: "0%",
      },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        {
          duration: 0,
        }
      )
    })
  }

  return (
    <span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onMouseEnter={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary "
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

export default LetterSwapForward

```

### Ping Pong animation

### Cli

```bash
shadcn@latest add "https://uwuui.com/r/letter-swap-pingpong-anim.json"
```

### Manual

Install the following dependencies:

```bash
lodash
```

Lodash is used for debouncing here — so the animation doesn't break on rapid hover changes.

Then, copy the source code:

#### letter-swap-pingpong-anim

```tsx
"use client"

import { useState } from "react"
import { debounce } from "lodash"
import { AnimationOptions, motion, stagger, useAnimate } from "motion/react"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
}

const LetterSwapPingPong = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary "
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export default LetterSwapPingPong

```

## Understanding the component

1. First, we duplicate the text we want to animate. We'll have two identical copies of the text.

2. We create a container `<span>` element with these key properties:

   - `position: relative` - This establishes a positioning context
   - `overflow: hidden` - This ensures text outside the container boundaries is hidden

3. For each copy of the text:

   - We split it into individual letters
   - Each letter is wrapped in its own `<span>` element, with `absolute` positioning
   - The letters from both copies are stacked vertically on top of each other (`top: 0`, and `top: 100%`)

4. When hovering:
   - The original letters slide upward out of view (hidden by overflow), by setting `top: 100%`
   - The duplicate letters slide up into the original position, by setting `top: 0`
   - This creates a smooth swapping effect

If `reverse` is enabled, the animation direction is flipped.

### Stagger

With the `staggerFrom` prop, you can control the index of the letter where the stagger animation starts.

Example:

```tsx
import LetterSwapForward from "@/fancy/components/text/letter-swap-forward-anim"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text-3xl flex md:flex-row flex-col items-center justify-center font-calendas gap-x-12 gap-y-4 bg-white  text-[#0015ff]">
      <LetterSwapForward label="First" staggerFrom={"first"} />
      <LetterSwapForward label="Center" staggerFrom={"center"} className="" />
      <LetterSwapForward label="Last" staggerFrom={"last"} />
    </div>
  )
}

```

### Line swap

By setting the `staggerDelay` prop to zero, you can create a line swap effect.

Example:

```tsx
import LetterSwapForward from "@/fancy/components/text/letter-swap-forward-anim"

export default function Preview() {
  return (
    <div className="w-dvw h-dvh text-3xl flex flex-row gap-12 items-center justify-center font-calendas bg-[#0015ff]">
      <div className="items-center justify-center grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12  text-white">
        <LetterSwapForward label="oh, wow!" staggerDuration={0} />
        <LetterSwapForward label="nice!" staggerDuration={0} reverse={false} />
      </div>
    </div>
  )
}

```

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| label* | `string` | - | The text to be displayed and animated |
| reverse | `boolean` | `true` | Direction of the animation (true: bottom to top, false: top to bottom) |
| transition | `AnimationOptions` | `{ type: "spring", duration: 0.7 }` | Animation configuration for each letter. Refer to motion docs for more details |
| staggerDuration | `number` | `0.03` | Delay between each letter's animation start |
| staggerFrom | `"first" | "last" | "center" | number` | `"first"` | Starting point of the stagger effect |
| className | `string` | - | Additional CSS classes for styling |
| onClick | `() => void` | - | Callback function for click events |

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/text/letter-swap).*